import os
import requests
from config.dockerhub import config
from controllers.app import AppController


def main():
    response = requests.post(os.environ.get('PLUGS_SERVICE_INITIALIZE_URL'), json=config)
    response.raise_for_status()
    AppController.run()


if __name__ == '__main__':
    main()
