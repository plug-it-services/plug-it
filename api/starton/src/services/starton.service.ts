import { Injectable, Logger } from '@nestjs/common';
import { AmqpService } from '../services/amqp.service';
import { WebHookService } from '../services/webhook.service';
import { BN } from 'bn.js';
import axios from 'axios';

@Injectable()
export class StartonService {
  private logger = new Logger(StartonService.name);

  constructor(
    private webhookService: WebHookService,
    private readonly amqpService: AmqpService,
  ) {}

  async addressSentNativeCurrencyParse(body: any, uuid: string): Promise<void> {
    const from = body.data.transaction.from;
    const to = body.data.transaction.to;
    const value = body.data.transaction.value.hex;
    const valueString = new BN(value.substr(2), 16).toString(10);
    const { userId } = await this.webhookService.getWebhookByState(uuid);

    const variables = [
      {
        key: 'from',
        value: from,
      },
      {
        key: 'to',
        value: to,
      },
      {
        key: 'value',
        value: valueString,
      },
    ];

    await this.amqpService.publish(
      'plugs_events',
      'addressSentNativeTokens',
      userId,
      variables,
    );
    this.logger.log(`Published addressSentNativeTokens of user ${userId}`);
  }

  async addressReceivedNativeCurrencyParse(
    body: any,
    uuid: string,
  ): Promise<void> {
    const from = body.data.transaction.from;
    const to = body.data.transaction.to;
    const value = body.data.transaction.value.hex;
    const valueString = new BN(value.substr(2), 16).toString(10);
    const { userId } = await this.webhookService.getWebhookByState(uuid);

    const variables = [
      {
        key: 'from',
        value: from,
      },
      {
        key: 'to',
        value: to,
      },
      {
        key: 'value',
        value: valueString,
      },
    ];

    await this.amqpService.publish(
      'plugs_events',
      'addressReceivedNativeTokens',
      userId,
      variables,
    );
    this.logger.log(
      `Published addressReceivedNativeTokens for transaction of user ${userId}`,
    );
  }

  async addressActivityParse(body: any, uuid: string): Promise<void> {
    const from = body.data.transaction.from;
    const to = body.data.transaction.to;
    const value = body.data.transaction.value.hex;
    const valueString = new BN(value.substr(2), 16).toString(10);
    const { userId } = await this.webhookService.getWebhookByState(uuid);

    const variables = [
      {
        key: 'from',
        value: from,
      },
      {
        key: 'to',
        value: to,
      },
      {
        key: 'value',
        value: valueString,
      },
    ];

    await this.amqpService.publish(
      'plugs_events',
      'addressActivity',
      userId,
      variables,
    );
    this.logger.log(
      `Published addressActivity for transaction of user ${userId}`,
    );
  }

  async eventApprovalParse(body: any, uuid: string): Promise<void> {
    const owner = body.data.approval.owner;
    const spender = body.data.approval.spender;
    const contractAddress = body.data.approval.contractAddress;
    const value = body.data.approval.value.hex;
    const valueString = new BN(value.substr(2), 16).toString(10);
    const { userId } = await this.webhookService.getWebhookByState(uuid);

    const variables = [
      {
        key: 'owner',
        value: owner,
      },
      {
        key: 'spender',
        value: spender,
      },
      {
        key: 'value',
        value: valueString,
      },
      {
        key: 'contract',
        value: contractAddress,
      },
    ];

    await this.amqpService.publish(
      'plugs_events',
      'eventApproval',
      userId,
      variables,
    );
    this.logger.log(
      `Published eventApproval for transaction of user ${userId}`,
    );
  }

  async eventMintParse(body: any, uuid: string): Promise<void> {
    const to = body.data.mint.to;
    const contractAddress = body.data.mint.contractAddress;
    const value = body.data.mint.value.hex;
    const valueString = new BN(value.substr(2), 16).toString(10);
    const { userId } = await this.webhookService.getWebhookByState(uuid);

    const variables = [
      {
        key: 'to',
        value: to,
      },
      {
        key: 'value',
        value: valueString,
      },
      {
        key: 'contract',
        value: contractAddress,
      },
    ];

    await this.amqpService.publish(
      'plugs_events',
      'eventMint',
      userId,
      variables,
    );
    this.logger.log(`Published eventMint for transaction of user ${userId}`);
  }

  async eventTransferParse(body: any, uuid: string): Promise<void> {
    const from = body.data.transfer.from;
    const to = body.data.transfer.to;
    const contractAddress = body.data.transfer.contractAddress;
    const value = body.data.transfer.value.hex;
    const valueString = new BN(value.substr(2), 16).toString(10);
    const { userId } = await this.webhookService.getWebhookByState(uuid);

    const variables = [
      {
        key: 'from',
        value: from,
      },
      {
        key: 'to',
        value: to,
      },
      {
        key: 'value',
        value: valueString,
      },
      {
        key: 'contract',
        value: contractAddress,
      },
    ];

    await this.amqpService.publish(
      'plugs_events',
      'eventTransfer',
      userId,
      variables,
    );
    this.logger.log(
      `Published eventTransfer for transaction of user ${userId}`,
    );
  }

  async erc721EventTransferParse(body: any, uuid: string): Promise<void> {
    const from = body.data.transfer.from;
    const to = body.data.transfer.to;
    const contractAddress = body.data.transfer.contractAddress;
    const tokenId = body.data.transfer.tokenId.hex;
    const tokenIdString = new BN(tokenId.substr(2), 16).toString(10);
    const { userId } = await this.webhookService.getWebhookByState(uuid);

    const variables = [
      {
        key: 'from',
        value: from,
      },
      {
        key: 'to',
        value: to,
      },
      {
        key: 'tokenId',
        value: tokenIdString,
      },
      {
        key: 'contract',
        value: contractAddress,
      },
    ];

    await this.amqpService.publish(
      'plugs_events',
      'erc721EventTransfer',
      userId,
      variables,
    );
    this.logger.log(
      `Published erc721EventTransfer for transaction of user ${userId}`,
    );
  }

  async erc1155EventTransferSingleParse(
    body: any,
    uuid: string,
  ): Promise<void> {
    const from = body.data.transferSingle.from;
    const to = body.data.transferSingle.to;
    const operator = body.data.transferSingle.operator;
    const contractAddress = body.data.transferSingle.contractAddress;
    const tokenId = body.data.transferSingle.tokenId.hex;
    const tokenIdString = new BN(tokenId.substr(2), 16).toString(10);
    const value = body.data.transferSingle.value.hex;
    const valueString = new BN(value.substr(2), 16).toString(10);
    const { userId } = await this.webhookService.getWebhookByState(uuid);

    const variables = [
      {
        key: 'from',
        value: from,
      },
      {
        key: 'to',
        value: to,
      },
      {
        key: 'operator',
        value: operator,
      },
      {
        key: 'tokenId',
        value: tokenIdString,
      },
      {
        key: 'value',
        value: valueString,
      },
      {
        key: 'contract',
        value: contractAddress,
      },
    ];

    await this.amqpService.publish(
      'plugs_events',
      'eventTransfer',
      userId,
      variables,
    );
    this.logger.log(
      `Published erc1155EventTransferSingle for transaction of user ${userId}`,
    );
  }

  private async createWatcher(
    apiKey: string,
    name: string,
    description: string,
    webhook: string,
    type: string,
    confirmations: number,
    network: string,
    body: any,
  ): Promise<string> {
    const startonApi = axios.create({
      baseURL: 'https://api.starton.io',
      headers: {
        'x-api-key': apiKey,
      },
    });

    try {
      const response = await startonApi.post('/v3/watcher', {
        name, // Enter a name for your watcher
        description, // Enter a description for your watcher
        type, // Select an event type
        webhookUrl: webhook, // Enter the address of the webhook
        confirmationsBlocks: confirmations, // Depending on your needs, select the number of confirmed blocks before an event triggers your watcher
        network, // Enter a network, you can find the list of networks available in our API reference.
        ...body,
      });
      return response.data.id;
    } catch (e) {
      this.logger.error(`Error creating watcher: ${e}`);
      console.error(e);
      console.error(e.response.data);
      console.error(e.response.data.message);
    }
  }

  async createAddressWatcher(
    apiKey: string,
    name: string,
    description: string,
    network: string,
    address: string,
    confirmations: number,
    type:
      | 'native transaction sent'
      | 'native transaction received'
      | 'native transaction activity'
      | 'approval event'
      | 'mint event'
      | 'transfer event'
      | 'ERC721 transfer'
      | 'ERC1155 transfer single',
    webhook: string,
  ): Promise<string> {
    const convertion = {
      'native transaction sent': 'ADDRESS_SENT_NATIVE_TRANSACTION',
      'native transaction received': 'ADDRESS_RECEIVED_NATIVE_TRANSACTION',
      'native transaction activity': 'ADDRESS_ACTIVITY',
      'approval event': 'EVENT_APPROVAL',
      'mint event': 'EVENT_MINT',
      'transfer event': 'EVENT_TRANSFER',
      'ERC721 transfer': 'ERC721_EVENT_TRANSFER',
      'ERC1155 transfer single': 'ERC1155_EVENT_TRANSFER_SINGLE',
    };

    return this.createWatcher(
      apiKey,
      name,
      description,
      webhook,
      convertion[type],
      confirmations,
      network,
      {
        address,
      },
    );
  }

  async deleteWatcher(apiKey: string, webhookId?: string): Promise<void> {
    const startonApi = axios.create({
      baseURL: 'https://api.starton.io',
      headers: {
        'x-api-key': apiKey,
      },
    });

    try {
      await startonApi.delete(`/v3/watcher/${webhookId}`);
    } catch (e) {
      this.logger.error(`Error creating watcher: ${e}`);
      console.error(e);
      console.error(e.response.data);
      console.error(e.response.data.message);
    }
  }
}
