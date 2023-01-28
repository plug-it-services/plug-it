import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StartonService {
  async createWatcher(
    apiKey: string,
    name: string,
    description: string,
    network: string,
    address: string,
    confirmations: string,
    type: string,
    webhook: string,
  ): Promise<any> {
    const startonApi = axios.create({
      baseURL: 'https://api.starton.io',
      headers: {
        'x-api-key': apiKey,
      },
    });

    return startonApi.post('/v3/watcher', {
      name, // Enter a name for your watcher
      description, // Enter a description for your watcher
      address, // Enter the address to watch (either a wallet or a smart contract)
      network, // Enter a network, you can find the list of networks available in our API reference.
      type, // Select an event type
      webhookUrl: webhook, // Enter the address of the webhook
      confirmationsBlocks: confirmations, // Depending on your needs, select the number of confirmed blocks before an event triggers your watcher
    });
  }
}
