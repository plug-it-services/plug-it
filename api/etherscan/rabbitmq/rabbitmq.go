package rabbitmq

import (
	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQService struct {
	Conn *amqp.Connection
	Ch   *amqp.Channel
}

type RabbitMQServiceInterface interface {
	Disconnect() error
	PublishMessage(queue string, exchange string, message []byte) error
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

func (r *RabbitMQService) Disconnect() error {
	if err := r.Ch.Close(); err != nil {
		return err
	}
	if err := r.Conn.Close(); err != nil {
		return err
	}
	return nil
}

func (r *RabbitMQService) PublishMessage(queue string, exchange string, message []byte) error {
	err := r.Ch.Publish(
		exchange,
		queue,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        message,
		},
	)
	if err != nil {
		return err
	}
	return nil
}
