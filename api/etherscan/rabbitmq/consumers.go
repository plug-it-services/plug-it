package rabbitmq

import (
	"encoding/json"
	"log"
	"strconv"

	"github.com/jinzhu/gorm"
	"github.com/plug-it-services/plug-it/etherscan"
	"github.com/plug-it-services/plug-it/models"
	"github.com/plug-it-services/plug-it/services"
	amqp "github.com/rabbitmq/amqp091-go"
	"gopkg.in/robfig/cron.v2"
)

type EventMessageData struct {
	PlugId  string `json:"plugId"`
	UserId  int    `json:"userId"`
	EventId string `json:"eventId"`
	Fields  string `json:"fields"`
}

type LowerGasPriceFields struct {
	GasPrice string `json:"gasPrice"`
}

func createCronJob(spec string, callback func(rabbit *RabbitMQService, user models.User, plugId string, eventId string, data string), rabbit *RabbitMQService, user models.User, plugId string, eventId string, data string) (cron.EntryID, error) {
	s := cron.New()

	id, err := s.AddFunc(spec, func() {
		callback(rabbit, user, plugId, eventId, data)
	})
	if err != nil {
		return -1, err
	}

	s.Start()

	return id, nil
}

func eventCallback(rabbit *RabbitMQService, user models.User, plugId string, eventId string, data string) {
	log.Println("event triggered", user.ApiKey, plugId, eventId, data)

	switch eventId {
	case "lowerGasPrice":
		log.Println("lowerGasPrice triggered", user.ApiKey, plugId, eventId, data)
		gasPrice, err := etherscan.GetGasPrice(user.ApiKey)
		if err != nil {
			log.Println("Error getting gas price", err)
			return
		}

		expectedGasPrice, err := strconv.Atoi(data)
		if err != nil {
			log.Println("Error converting gas price", err)
			return
		}
		if gasPrice < expectedGasPrice {
			log.Println("Gas price is lower than expected", gasPrice, data)
		}

		rabbit.PublishEvent("plugs_events", eventId, plugId, user.Id, map[string]interface{}{
			"key":   "gasPrice",
			"value": strconv.Itoa(gasPrice),
		})
	default:
		log.Println("Event not supported", eventId)
	}
}

func EventInitializeConsumer(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery) {
	log.Println("Event Received", string(msg.Body))
	var data EventMessageData

	if err := json.Unmarshal(msg.Body, &data); err != nil {
		log.Println("Error unmarshalling event message", err)
		msg.Ack(false)
		return
	}

	user, err := services.FindUserById(db, data.UserId)
	if err != nil {
		log.Println("Error finding user", err)
		msg.Ack(false)
		return
	}

	switch data.EventId {
	case "lowerGasPrice":
		var gasPrice LowerGasPriceFields
		if err := json.Unmarshal([]byte(data.Fields), &gasPrice); err != nil {
			log.Println("Error unmarshalling event message", err)
			msg.Ack(false)
			return
		}

		id, err := createCronJob("*/5 * * * * *", eventCallback, rabbit, user, data.PlugId, data.EventId, gasPrice.GasPrice)
		if err != nil {
			log.Println("Error creating cron job", err)
			msg.Ack(false)
			return
		}
		if err := services.CreateCron(db, data.UserId, int(id)); err != nil {
			log.Println("Error saving cron job", err)
			msg.Ack(false)
			return
		}
	default:
		log.Println("Event not supported", data.EventId)
	}
	msg.Ack(false)
}

func EventDisabledConsumer(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery) {
	log.Println("Event disabled received", string(msg.Body))

	msg.Ack(false)
}

func ActionConsumer(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery) {
	log.Println("Action received", string(msg.Body))

	msg.Ack(false)
}
