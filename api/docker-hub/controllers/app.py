import json
import os

import requests
from flask import Flask, request
from models.Connection import Connection
from services.connections import ConnectionsService
from services.hub import HubService
from services.webhooks import WebhooksService
from listener import ListenerController

app = Flask(__name__)
connections_service = ConnectionsService()
hub_service = HubService()
webhooks_service = WebhooksService()


class AppController:
    @staticmethod
    @app.route('/public/clientSecrets', methods=['POST'])
    def login():
        # return body of request
        user_header = request.headers.get('user')
        app.logger.info("user header: {0}".format(user_header))
        user = json.loads(user_header)
        app.logger.info(user)
        app.logger.info("Connecting user {0} to Docker Hub...".format(user['id']))
        creds = request.get_json()

        jwt = hub_service.authenticate(creds['clientId'], creds['clientSecret'])
        if jwt is None:
            app.logger.info("Invalid credentials for user {0} with username {1}.".format(user['id'], creds['clientId']))
            return {'message': 'invalid credentials'}, 401
        connection = connections_service.get(user['id'])
        if connection is not None:
            app.logger.info("Updating connection for user {0} with username {1}...".format(user['id'], creds['clientId']))
            connections_service.update(user['id'], Connection(
                user_id=user['id'],
                username=creds['clientId'],
                token=creds['clientSecret'],
                jwt=jwt
            ))
        else:
            app.logger.info("Creating connection for user {0} with username {1}...".format(user['id'], creds['clientId']))
            connections_service.save(Connection(
                user_id=user['id'],
                username=creds['clientId'],
                token=creds['clientSecret'],
                jwt=jwt
            ))
        app.logger.info("Connection successful for user {0} with username {1}. Notifying Plugs service...".format(user['id'], creds['clientId']))

        response = requests.post(os.environ.get('PLUGS_SERVICE_LOGGED_IN_URL'), json={
            'userId': user['id'],
        })
        response.raise_for_status()
        app.logger.info("Plugs service notified.")
        return {'message': 'success'}

    @staticmethod
    @app.route('/public/disconnect', methods=['POST'])
    def disconnect():
        user = json.loads(request.headers.get('user'))
        app.logger.info("Disconnecting user {0} from Docker Hub...".format(user['id']))
        connection = connections_service.get(user['id'])
        if connection is None:
            app.logger.info("User {0} is not connected to Docker Hub.".format(user['id']))
            return {'message': 'not connected'}, 404
        webhooks = webhooks_service.get_by_user_id(user['id'])
        for webhook in webhooks:
            app.logger.info("Deleting webhook {0} for user {1}...".format(webhook.slug, user['id']))
            hub_service.delete_webhook(connection.username, 'plug-it', webhook.slug, connection.jwt)
            webhooks_service.delete(webhook.id)
        connections_service.delete(user['id'])
        app.logger.info("Disconnected user {0} from Docker Hub. Notifying plugs service...".format(user['id']))
        response = requests.post(os.environ.get('PLUGS_SERVICE_LOGGED_OUT_URL'), json={
            'userId': user['id'],
        })
        response.raise_for_status()
        app.logger.info("Plugs service notified.")
        return {'message': 'success'}

    @staticmethod
    @app.route('/public/<webhook_id>', methods=['POST'])
    def webhook(webhook_id):
        webhook = webhooks_service.get(webhook_id)
        if webhook is None:
            app.logger.info("Webhook {0} not found.".format(webhook_id))
            return {'message': 'not found'}, 404
        app.logger.info("Webhook {0} found. Notifying plugs service...".format(webhook_id))
        ListenerController.fire_event('repositoryUpdate', webhook.plug_id, webhook.user_id, request.get_json())
        app.logger.info("Plugs service notified.")
        return {'message': 'success'}


    @staticmethod
    def run():
        app.run(debug=True, host="0.0.0.0", port=os.environ.get('PORT'))
