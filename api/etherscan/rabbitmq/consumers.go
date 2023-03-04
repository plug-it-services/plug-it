package rabbitmq

import (
	"encoding/json"
	"log"
	"strconv"
	"time"

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

type ActionMessage struct {
	PlugId   string  `json:"plugId"`
	UserId   int     `json:"userId"`
	ActionId string  `json:"actionId"`
	RunId    string  `json:"runId"`
	Fields   []Value `json:"fields"`
}

type EventDisabledMessage struct {
	PlugId  string `json:"plugId"`
	UserId  int    `json:"userId"`
	EventId string `json:"eventId"`
}

func CreateCronJob(cr *cron.Cron, spec string, callback func(rabbit *RabbitMQService, user models.User, plugId string, eventId string, data string), rabbit *RabbitMQService, user models.User, plugId string, eventId string, data string) (cron.EntryID, error) {
	id, err := cr.AddFunc(spec, func() {
		callback(rabbit, user, plugId, eventId, data)
	})
	if err != nil {
		return -1, err
	}

	cr.Start()

	log.Println("Cron job created", id)

	return id, nil
}

func findInsideFields(fields []Value, key string) string {
	for _, field := range fields {
		if field.Key == key {
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

func EventInitializeConsumer(cr *cron.Cron, db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery) {
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
		gasPrice := findInsideFields(data.Fields, "gasPrice")

		id, err := CreateCronJob(cr, "*/5 * * * *", EventCallback, rabbit, user, data.PlugId, data.EventId, gasPrice)
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

func EventDisabledConsumer(cr *cron.Cron, db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery) {
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

	log.Println("Cron job delete", cron.EntryID(c.CronId))

	cr.Remove(cron.EntryID(c.CronId))

	if err := services.DeleteCron(db, c.Id); err != nil {
		log.Println("Error deleting cron job", err)
		msg.Ack(true)
		return
	}
	msg.Ack(true)
}

func ActionConsumer(cr *cron.Cron, db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery) {
	log.Println("Action received", string(msg.Body))
	var data ActionMessage

	if err := json.Unmarshal(msg.Body, &data); err != nil {
		log.Println("Error unmarshalling action message", err)
		msg.Ack(true)
		return
	}

	user, err := services.FindUserById(db, data.UserId)
	if err != nil {
		log.Println("Error finding user", err)
		msg.Ack(true)
		return
	}

	var variables []Value

	switch data.ActionId {
	case "gasPrice":
		gasPrice, err := etherscan.GetGasPrice(user.ApiKey)
		if err != nil {
			log.Println("Error getting gas price", err)
			msg.Ack(true)
			return
		}
		variables = append(variables, Value{
			Key:   "gasPrice",
			Value: strconv.Itoa(gasPrice),
		})
	case "blockNumber":
		blockNumber, err := etherscan.GetBlockNumber(user.ApiKey, strconv.Itoa(int(time.Now().Unix())))
		if err != nil {
			log.Println("Error getting block number", err)
			msg.Ack(true)
			return
		}
		variables = append(variables, Value{
			Key:   "blockNumber",
			Value: blockNumber,
		})
	case "totalSupply":
		contractAddress := findInsideFields(data.Fields, "contractAddress")

		totalSupply, err := etherscan.GetTotalSupply(user.ApiKey, contractAddress)
		if err != nil {
			log.Println("Error getting total supply", err)
			msg.Ack(true)
			return
		}
		variables = append(variables, Value{
			Key:   "totalSupply",
			Value: totalSupply,
		})
	case "balance":
		contractAddress := findInsideFields(data.Fields, "contractAddress")
		address := findInsideFields(data.Fields, "address")

		balance, err := etherscan.GetBalance(user.ApiKey, contractAddress, address)
		if err != nil {
			log.Println("Error getting balance", err)
			msg.Ack(true)
			return
		}
		variables = append(variables, Value{
			Key:   "balance",
			Value: balance,
		})
	default:
		log.Println("Event not supported", data.ActionId)
	}

	if err := rabbit.PublishAction("plug_action_finished", data.ActionId, data.RunId, data.PlugId, user.Id, variables); err != nil {
		log.Println("Error publishing action finished", err)
		msg.Ack(true)
		return
	}

	msg.Ack(true)
}
