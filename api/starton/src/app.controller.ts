import { Controller, Logger } from '@nestjs/common';
import { StartonService } from './services/starton.service';
import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { UserService } from './services/user.service';
import { UserEntity } from './entities/user.entity';
import { WebHookService } from './services/webhook.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    private readonly startonService: StartonService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly webhookService: WebHookService,
  ) {}

  @RabbitSubscribe({
    queue: 'plug_action_starton_triggers',
  })
  async triggerAction(msg: any) {
    // No actions
  }

  @RabbitSubscribe({
    queue: 'plug_event_starton_disabled',
  })
  async disableEvent(msg: any) {
    try {
      const user = await this.userService.getUserById(msg.userId);
      const webhook = await this.webhookService.find(
        msg.userId,
        msg.plugId,
        msg.eventId,
      );

      await this.startonService.deleteWatcher(user.apiKey, webhook.webhookId);

      this.logger.log(
        `Deleting webhook ${webhook.webhookId} for user ${user.id}`,
      );
      await this.webhookService.deleteById(webhook.webhookId);
    } catch (e) {
      this.logger.error(`Error while disabling event : ${e}`);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    queue: 'plug_event_starton_initialize',
  })
  async listenForEvents(msg: any) {
    try {
      this.logger.log(`Received event initialize: ${JSON.stringify(msg)}`);
      const userId = msg.userId;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        this.logger.error(`User ${userId} not connected to Starton`);
        return;
      }

      switch (msg.eventId) {
        case 'addressReceivedNativeTokens':
          await this.addressTokensEvent(user, msg, 'native currency received');
          break;
        case 'addressSentNativeCurrency':
          await this.addressTokensEvent(user, msg, 'native currency sent');
          break;
        case 'addressActivity':
          await this.addressTokensEvent(user, msg, 'native currency activity');
          break;
        case 'eventApproval':
          await this.addressTokensEvent(user, msg, 'approval event');
          break;
        case 'eventMint':
          await this.addressTokensEvent(user, msg, 'mint event');
          break;
        case 'eventTransfer':
          await this.addressTokensEvent(user, msg, 'transfer event');
          break;
        case 'erc721eventTransfer':
          await this.addressTokensEvent(user, msg, 'ERC721 transfer');
          break;
        case 'erc1155EventTransferSingle':
          await this.addressTokensEvent(user, msg, 'ERC1155 transfer single');
          break;
      }
    } catch (e) {
      this.logger.error(`Error while initializing event : ${e}`);
      return new Nack(false);
    }
  }

  async addressTokensEvent(
    user: UserEntity,
    msg: any,
    type:
      | 'native currency sent'
      | 'native currency received'
      | 'native currency activity'
      | 'approval event'
      | 'mint event'
      | 'transfer event'
      | 'ERC721 transfer'
      | 'ERC1155 transfer single',
  ) {
    const address = msg.fields.find((v) => v.key === 'address').value;
    const confirmations = parseInt(
      msg.fields.find((v) => v.key === 'confirmations').value,
    );
    const network = msg.fields.find((v) => v.key === 'network').value;
    const name = `${type.replace(/\b\w/g, (l) =>
      l.toUpperCase(),
    )} for ${address}`;
    const description = `A watcher to know if ${address} for ${type.replace(
      /\b\w/g,
      (l) => l.toUpperCase(),
    )}`;
    const uuid = uuidv4();

    await this.webhookService.create(uuid, user.id, msg.plugId, msg.eventId);

    const webhookUrl = `${this.configService.getOrThrow(
      'WEBHOOK_BASE_URL',
    )}/${uuid}`;

    const webhookId = await this.startonService.createAddressWatcher(
      user.apiKey,
      name,
      description,
      network,
      address,
      confirmations,
      type,
      webhookUrl,
    );
    await this.webhookService.addWebhookId(uuid, webhookId);
  }
}
