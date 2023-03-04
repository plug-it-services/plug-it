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

type Value struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type EventMessage struct {
	PlugId  string  `json:"plugId"`
	UserId  int     `json:"userId"`
	EventId string  `json:"eventId"`
	Fields  []Value `json:"fields"`
}

type EventDisabledMessage struct {
	PlugId  string `json:"plugId"`
	UserId  int    `json:"userId"`
	EventId string `json:"eventId"`
}

func CreateCronJob(spec string, callback func(rabbit *RabbitMQService, user models.User, plugId string, eventId string, data string), rabbit *RabbitMQService, user models.User, plugId string, eventId string, data string) (cron.EntryID, error) {
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

func findInsideFields(event EventMessage) string {
	for _, field := range event.Fields {
		if field.Key == "gasPrice" {
			return field.Value
		}
	}
	return ""
}

func EventCallback(rabbit *RabbitMQService, user models.User, plugId string, eventId string, data string) {
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
			err := rabbit.PublishEvent("plugs_events", eventId, plugId, user.Id, []Value{
				{
					Key:   "gasPrice",
					Value: strconv.Itoa(gasPrice),
				},
			})
			if err != nil {
				log.Println("Error publishing event", err)
			}
		}
	default:
		log.Println("Event not supported", eventId)
	}
}

func EventInitializeConsumer(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery) {
	log.Println("Event Received", string(msg.Body))
	var data EventMessage

	if err := json.Unmarshal(msg.Body, &data); err != nil {
		log.Println("Error unmarshalling event message", err)
		msg.Ack(true)
		return
	}

	user, err := services.FindUserById(db, data.UserId)
	if err != nil {
		log.Println("Error finding user", err)
		msg.Ack(true)
		return
	}

	switch data.EventId {
	case "lowerGasPrice":
		gasPrice := findInsideFields(data)

		id, err := CreateCronJob("*/5 * * * *", EventCallback, rabbit, user, data.PlugId, data.EventId, gasPrice)
		if err != nil {
			log.Println("Error creating cron job", err)
			msg.Ack(true)
			return
		}
		if err := services.CreateCron(db, data.UserId, int(id), data.PlugId, gasPrice, data.EventId); err != nil {
			log.Println("Error saving cron job", err)
			msg.Ack(true)
			return
		}
	default:
		log.Println("Event not supported", data.EventId)
	}
	msg.Ack(true)
}

func EventDisabledConsumer(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery) {
	log.Println("Event disabled received", string(msg.Body))
	var data EventDisabledMessage

	if err := json.Unmarshal(msg.Body, &data); err != nil {
		log.Println("Error unmarshalling event disabled message", err)
		msg.Ack(true)
		return
	}

	c, err := services.FindCronByPlugId(db, data.PlugId)
	if err != nil {
		log.Println("Error finding cron job", err)
		msg.Ack(true)
		return
	}

	cron.New().Remove(cron.EntryID(c.Id))

	if err := services.DeleteCron(db, c.Id); err != nil {
		log.Println("Error deleting cron job", err)
		msg.Ack(true)
		return
	}
	msg.Ack(true)
}

func ActionConsumer(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery) {
	log.Println("Action received", string(msg.Body))

	msg.Ack(true)
}
