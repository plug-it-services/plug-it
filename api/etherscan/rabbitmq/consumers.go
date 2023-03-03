package rabbitmq

import (
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

func EventConsumer(msg amqp.Delivery) {
	fmt.Println("Body:", string(msg.Body), "Timestamp:", msg.Timestamp)
	msg.Ack(false)
}

func ActionConsumer(msg amqp.Delivery) {
	fmt.Println("Body:", string(msg.Body), "Timestamp:", msg.Timestamp)
	msg.Ack(false)
}
