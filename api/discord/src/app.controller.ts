import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { Controller, Logger } from '@nestjs/common';
import { DiscordService } from './discord/discord.service';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private discordService: DiscordService) {}

  @RabbitSubscribe({
    queue: 'plug_action_discord_triggers',
  })
  async triggerAction(msg: any) {
    this.logger.log(`Received event trigger: ${JSON.stringify(msg)}`);
    const { actionId, userId } = msg;
    let content;
    let id;

    switch (actionId) {
      case 'pm':
        content = msg.fields.find(
          (field: any) => field.key === 'content',
        ).value;
        id = msg.fields.find((field: any) => field.key === 'id').value;

        await this.discordService.sendPrivateMessage(id, content);
      case 'channel_message':
        content = msg.fields.find(
          (field: any) => field.key === 'content',
        ).value;
        id = msg.fields.find((field: any) => field.key === 'id').value;

        await this.discordService.sendChannelMessage(id, content);
    }
    return new Nack(false);
  }

  @RabbitSubscribe({
    queue: 'plug_event_discord_initialize',
  })
  async listenForEvents(msg: any) {
    this.logger.log(`Received event initialize: ${JSON.stringify(msg)}`);
    const uid = msg.userId;

    // TODO: Implement
  }
}