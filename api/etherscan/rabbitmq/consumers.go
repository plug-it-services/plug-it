package rabbitmq

import (
	"encoding/json"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/plug-it-services/plug-it/services"
	amqp "github.com/rabbitmq/amqp091-go"
	"gopkg.in/robfig/cron.v2"
)

type EventMessageData struct {
	PlugId  string `json:"plugId"`
	UserId  int    `json:"userId"`
	EventId string `json:"eventId"`
}

func createCronJob(spec string, callback func(string), apiKey string) (cron.EntryID, error) {
	s := cron.New()

	id, err := s.AddFunc(spec, func() {
		callback(apiKey)
	})
	if err != nil {
		return -1, err
	}

	s.Start()

	return id, nil
}

func EventLowerGasPriceConsumer(apiKey string) {
	log.Println("Lower gas price event triggered", apiKey)
}

func EventInitializeConsumer(c *gin.Context, msg amqp.Delivery) {
	log.Println("Event Received", string(msg.Body))
	var data EventMessageData

	if err := json.Unmarshal(msg.Body, &data); err != nil {
		log.Println("Error unmarshalling event message", err)
		msg.Ack(false)
		return
	}

	user, err := services.FindUserById(c, data.UserId)
	if err != nil {
		log.Println("Error finding user", err)
		msg.Ack(false)
		return
	}

	switch data.EventId {
	case "lowerGasPrice":
		id, err := createCronJob("*/5 * * * * *", EventLowerGasPriceConsumer, user.ApiKey)
		if err != nil {
			log.Println("Error creating cron job", err)
			msg.Ack(false)
			return
		}
		if err := services.CreateCron(c, data.UserId, int(id)); err != nil {
			log.Println("Error saving cron job", err)
			msg.Ack(false)
			return
		}
	default:
		log.Println("Event not supported", data.EventId)
	}
	msg.Ack(false)
}

func EventDisabledConsumer(c *gin.Context, msg amqp.Delivery) {
	log.Println("Event disabled received", string(msg.Body))

	msg.Ack(false)
}

func ActionConsumer(c *gin.Context, msg amqp.Delivery) {
	log.Println("Action received", string(msg.Body))

	msg.Ack(false)
}
