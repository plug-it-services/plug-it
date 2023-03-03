package rabbitmq

import (
	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQService struct {
	Conn *amqp.Connection
	Ch   *amqp.Channel
}

type RabbitMQServiceInterface interface {
	Close() error
	CreateQueue(queue string, exchange string) error
	PublishMessage(queue string, exchange string, message []byte) error
	CreateConsumer(queue string, wow func(msg amqp.Delivery)) error
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

func (r *RabbitMQService) CreateConsumer(queue string, wow func(msg amqp.Delivery)) error {
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
			wow(msg)
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
