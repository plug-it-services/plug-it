import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { StartonService } from './services/starton.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { UserService } from './services/user.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly startonService: StartonService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @RabbitSubscribe({
    queue: 'plug_action_starton_triggers',
  })
  async triggerAction(msg: any) {
    // TODO: Implement
  }

  @RabbitSubscribe({
    queue: 'plug_event_starton_initialize',
  })
  async listenForEvents(msg: any) {
    const uid = msg.userId;
    const user = await this.userService.getUserById(uid);

    switch (msg.eventId) {
      case 'addressReceivedNativeTokens':
        const address = msg.variables.find((v) => v.key === 'address').value;
        const confirmations = msg.variables.find(
          (v) => v.key === 'confirmations',
        ).value;
        const network = msg.variables.find((v) => v.key === 'network').value;
        const name = `Address Received Native Transaction ${address}`;
        const description = `A watcher to know if ${address} received a native transaction on ${network} with ${confirmations} confirmations`;
        const watcherType = 'ADDRESS_RECEIVED_NATIVE_CURRENCY';

        const webhookUrl = `${this.configService.getOrThrow(
          'WEBHOOK_URL',
        )}/${uid}`;

        await this.startonService.createWatcher(
          user.apiKey,
          name,
          description,
          network,
          address,
          confirmations,
          watcherType,
          webhookUrl,
        );
        break;
    }
  }
}
