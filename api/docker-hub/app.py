import os
from multiprocessing import Process

import requests
from config.dockerhub import config
from controllers.app import AppController
from controllers.listener import ListenerController


def launchHttpServer():
    AppController.run()


def launchListener():
    ListenerController.start()


def main():
    response = requests.post(os.environ.get('PLUGS_SERVICE_INITIALIZE_URL'), json=config)
    response.raise_for_status()
    p1 = Process(target=launchHttpServer)
    p2 = Process(target=launchListener)
    p1.start()
    p2.start()
    p1.join()


if __name__ == '__main__':
    main()
