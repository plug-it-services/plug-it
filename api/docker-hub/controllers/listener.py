import json
import os
import uuid
from time import sleep

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
            print('Initializing event {0} for user {1}...'.format(msg['eventId'], msg['userId']), flush=True)
            if msg['eventId'] == 'repositoryUpdate':
                ListenerController.setup_repository_update(msg)
            print('Initialized event {0} for user {1}.'.format(msg['eventId'], msg['userId']), flush=True)
            chan.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            print(repr(e), flush=True)
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
        print('Setting up repository update for user {0}...'.format(msg['userId']), flush=True)
        print(msg['fields'], flush=True)
        repository = list(filter(lambda e: e['key'] == 'repository', msg['fields']))[0]['value']
        conn = connections_service.get(msg['userId'])
        if conn is None:
            raise Exception("No connection found for user {0}".format(msg['userId']))
        print('Authenticating user {0}...'.format(msg['userId']), flush=True)
        jwt = hub_service.authenticate(conn.username, conn.token)
        if jwt is None:
            raise Exception("Failed to authenticate user {0}".format(msg['userId']))
        webhook_id = uuid.uuid4()
        slug = hub_service.setup_webhook(conn.username, repository, webhook_id, jwt)
        print("Slug: {0}".format(slug), flush=True)
        if slug is None:
            raise Exception("Failed to setup webhook for user {0}".format(msg['userId']))

        webhooks_service.save(Webhook(id=webhook_id, slug=slug, user_id=msg['userId'], repository=repository, plug_id=msg['plugId']))

