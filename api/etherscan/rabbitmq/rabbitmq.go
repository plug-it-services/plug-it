package rabbitmq

import (
	"encoding/json"
	"log"
	"strconv"

	"github.com/jinzhu/gorm"
	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQService struct {
	Conn           *amqp.Connection
	Ch             []*amqp.Channel
	PublishChannel *amqp.Channel
}

type RabbitMQServiceInterface interface {
	Close() error
	CreateChannel() error
	CreateQueue(ch *amqp.Channel, queue string, exchange string) error
	PublishEvent(queue string, eventId string, plugId string, userId int, variables map[string]interface{}) error
	CreateConsumer(ch *amqp.Channel, db *gorm.DB, queue string, wow func(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery)) error
}

func New(uri string) (*RabbitMQService, error) {
	conn, err := amqp.Dial(uri)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	return &RabbitMQService{
		Conn:           conn,
		PublishChannel: ch,
	}, nil
}

func (r *RabbitMQService) CreateChannel() (*amqp.Channel, error) {
	ch, err := r.Conn.Channel()
	if err != nil {
		return &amqp.Channel{}, err
	}
	r.Ch = append(r.Ch, ch)
	return ch, nil
}

func (r *RabbitMQService) CreateConsumer(ch *amqp.Channel, db *gorm.DB, queue string, wow func(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery)) error {
	msgs, err := ch.Consume(
		queue,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	go func() {
		for msg := range msgs {
			wow(db, r, msg)
		}
	}()
	return nil
}

func (r *RabbitMQService) CreateQueue(ch *amqp.Channel, queue string, exchange string) error {
	q, err := ch.QueueDeclare(
		queue,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}
	err = ch.QueueBind(q.Name, queue, "amq.direct", false, nil)
	if err != nil {
		return err
	}
	return nil
}

func (r *RabbitMQService) Close() error {
	log.Println("Closing RabbitMQ connection")
	for _, ch := range r.Ch {
		if err := ch.Close(); err != nil {
			return err
		}
	}
	if err := r.Conn.Close(); err != nil {
		return err
	}
	return nil
}

func (r *RabbitMQService) PublishEvent(queue string, eventId string, plugId string, userId int, variables map[string]interface{}) error {
	parsedVariables, err := json.Marshal(variables)
	if err != nil {
		return err
	}

	log.Println("Publishing event to queue: " + `{"serviceName: "discord", "eventId":"` + eventId + `","plugId":"` + plugId + `","userId":` + strconv.Itoa(userId) + `,"variables":` + string(parsedVariables) + `}`)
	err = r.PublishChannel.Publish(
		"amq.direct",
		queue,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        []byte(`{"serviceName: "discord", "eventId":"` + eventId + `","plugId":"` + plugId + `","userId":` + strconv.Itoa(userId) + `,"variables":` + string(parsedVariables) + `}`),
		},
	)
	if err != nil {
		return err
	}
	return nil
}
