import os
from typing import Any

import requests


class HubService:
    @staticmethod
    def authenticate(username, token) -> str | None:
        response = requests.post('https://hub.docker.com/v2/users/login/', json={
            'username': username,
            'password': token,
        })
        if response.status_code != 200:
            return None
        return response.json()['token']

    @staticmethod
    def setup_webhook(username, repository, webhook_id, jwt) -> str | None:
        url = "https://hub.docker.com/v2/repositories/{0}/{1}/webhook_pipeline".format(username, repository)
        response = requests.post(url, json={
            'name': "Plug it",
            "expect_final_callback": False,
            "webhooks": [
                {
                    "name": "Plug it callback",
                    "hook_url": os.environ.get('PLUG_IT_WEBHOOK_URL') + "/{0}".format(webhook_id),
                }
            ]
        },
            headers={
                'Authorization': 'Bearer {0}'.format(jwt)
         })
        if response.status_code != 200:
            return None
        return response.json()['slug']

    @staticmethod
    def delete_webhook(username, repository, slug, jwt) -> None:
        url = "https://hub.docker.com/v2/repositories/{0}/{1}/webhook_pipeline/{2}".format(username, repository, slug)
        response = requests.delete(url, headers={
            'Authorization': 'Bearer {0}'.format(jwt)
        })
        response.raise_for_status()
