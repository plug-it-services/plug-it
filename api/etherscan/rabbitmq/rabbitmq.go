package rabbitmq

import (
	"encoding/json"
	"strconv"

	"github.com/jinzhu/gorm"
	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQService struct {
	Conn *amqp.Connection
	Ch   *amqp.Channel
}

type RabbitMQServiceInterface interface {
	Close() error
	CreateQueue(queue string, exchange string) error
	PublishEvent(queue string, eventId string, plugId string, userId int, variables map[string]interface{}) error
	CreateConsumer(db *gorm.DB, queue string, wow func(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery)) error
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
		Conn: conn,
		Ch:   ch,
	}, nil
}

func (r *RabbitMQService) CreateConsumer(db *gorm.DB, queue string, wow func(db *gorm.DB, rabbit *RabbitMQService, msg amqp.Delivery)) error {
	msgs, err := r.Ch.Consume(
		queue,
		"",
		true,
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

func (r *RabbitMQService) CreateQueue(queue string, exchange string) error {
	q, err := r.Ch.QueueDeclare(
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
	err = r.Ch.QueueBind(q.Name, queue, "amq.direct", false, nil)
	if err != nil {
		return err
	}
	return nil
}

func (r *RabbitMQService) Close() error {
	if err := r.Ch.Close(); err != nil {
		return err
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

	err = r.Ch.Publish(
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
