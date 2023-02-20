import json
import os
import uuid
import pika

from models.Webhook import Webhook
from services.connections import ConnectionsService
from services.hub import HubService
from services.webhooks import WebhooksService

connections_service = ConnectionsService()
webhooks_service = WebhooksService()
hub_service = HubService()

connection = pika.BlockingConnection(pika.connection.URLParameters(os.environ.get('RABBITMQ_URL')))
channel = connection.channel()
channel.queue_declare(queue=os.environ.get('EVENT_INITIALIZATION_QUEUE'))
channel.queue_bind(exchange='amq.direct', queue=os.environ.get('EVENT_INITIALIZATION_QUEUE'), routing_key=os.environ.get('EVENT_INITIALIZATION_QUEUE'))


class ListenerController:
    @staticmethod
    def initialize_event(chan, method, properties, body):
        try:
            msg = json.loads(body)
            if msg['eventId'] == 'repositoryUpdate':
                ListenerController.setup_repository_update(msg)
            chan.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            print(e)
            chan.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

    @staticmethod
    def fire_event(event_id, plug_id, user_id, variables):
        msg = {
            'serviceName': 'docker-hub',
            'eventId': event_id,
            'plugId': plug_id,
            'userId': user_id,
            'variables': variables
        }
        channel.basic_publish(exchange='amq.direct', routing_key=os.environ.get('EVENT_QUEUE'), body=json.dumps(msg))

    @staticmethod
    def start():
        channel.basic_consume(queue=os.environ.get('EVENT_INITIALIZATION_QUEUE'), on_message_callback=ListenerController.initialize_event, auto_ack=False)
        channel.start_consuming()

    @staticmethod
    def setup_repository_update(msg):
        conn = connections_service.get(msg['userId'])
        if conn is None:
            raise Exception("No connection found for user {0}".format(msg['userId']))
        jwt = hub_service.authenticate(conn.username, conn.token)
        if jwt is None:
            raise Exception("Failed to authenticate user {0}".format(msg['userId']))
        webhook_id = uuid.uuid4()
        slug = hub_service.setup_webhook(conn.username, msg['repository'], webhook_id, jwt)
        if slug is None:
            raise Exception("Failed to setup webhook for user {0}".format(msg['userId']))
        webhooks_service.save(Webhook(id=webhook_id, slug=slug, user_id=msg['userId'], repository=msg['repository'], plug_id=msg['plugId']))

