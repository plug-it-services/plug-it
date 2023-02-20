import os
import subprocess

import requests
from config.dockerhub import config
from controllers.app import AppController
from controllers.listener import ListenerController


def main():
    response = requests.post(os.environ.get('PLUGS_SERVICE_INITIALIZE_URL'), json=config)
    response.raise_for_status()
    p1 = subprocess.run(AppController.run(), check=True)
    p2 = subprocess.run(ListenerController.start(), check=True)
    p1.wait()
    p2.wait()


if __name__ == '__main__':
    main()
