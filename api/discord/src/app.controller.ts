import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { Controller, Logger } from '@nestjs/common';
import { DiscordService } from './discord/discord.service';
import { DiscordAuthService } from './discord/discordAuth.service';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    private discordService: DiscordService,
    private discordAuthService: DiscordAuthService,
  ) {}

  @RabbitSubscribe({
    queue: 'plug_action_discord_triggers',
  })
  async triggerAction(msg: any) {
    this.logger.log(`Received event trigger: ${JSON.stringify(msg)}`);
    const { actionId, userId } = msg;
    const { serverId } = await this.discordAuthService.retrieveByUserId(userId);

    switch (actionId) {
      case 'pm':
        const messageContent = msg.fields.find(
          (field: any) => field.key === 'content',
        ).value;
        const userId2 = msg.fields.find(
          (field: any) => field.key === 'id',
        ).value;

        await this.discordService.sendPrivateMessage(userId2, messageContent);
      case 'channel_message':
        const messageContent2 = msg.fields.find(
          (field: any) => field.key === 'content',
        ).value;
        const channelId = msg.fields.find(
          (field: any) => field.key === 'id',
        ).value;

        await this.discordService.sendChannelMessage(
          serverId,
          channelId,
          messageContent2,
        );
      case 'public_thread_create':
        const messageId = msg.fields.find(
          (field: any) => field.key === 'message_id',
        ).value;
        const name = msg.fields.find(
          (field: any) => field.key === 'name',
        ).value;
        const reason = msg.fields.find(
          (field: any) => field.key === 'reason',
        )?.value;
        const auto_archive_duration = msg.fields.find(
          (field: any) => field.key === 'auto_archive_duration',
        )?.value;
        const rate_limit_per_user = msg.fields.find(
          (field: any) => field.key === 'rate_limit_per_user',
        )?.value;

        await this.discordService.createPublicThread(
          serverId,
          messageId,
          name,
          reason,
          auto_archive_duration,
          rate_limit_per_user,
        );

      // TOOO: publish the thread id
      case 'private_thread_create':
        const channelId2 = msg.fields.find(
          (field: any) => field.key === 'channel_id',
        ).value;
        const name2 = msg.fields.find(
          (field: any) => field.key === 'name',
        ).value;
        const auto_archive_duration2 = msg.fields.find(
          (field: any) => field.key === 'auto_archive_duration',
        )?.value;
        const rate_limit_per_user2 = msg.fields.find(
          (field: any) => field.key === 'rate_limit_per_user',
        )?.value;

        await this.discordService.createPrivateThread(
          serverId,
          channelId2,
          name2,
          auto_archive_duration2,
          rate_limit_per_user2,
        );

      // TODO: publish the thread id
      case 'thread_delete':
        const threadId = msg.fields.find(
          (field: any) => field.key === 'thread_id',
        ).value;

        await this.discordService.deleteThread(serverId, threadId);
      case 'send_message_thread':
        const threadId2 = msg.fields.find(
          (field: any) => field.key === 'thread_id',
        ).value;
        const messageContent3 = msg.fields.find(
          (field: any) => field.key === 'content',
        ).value;

        await this.discordService.sendMessageInThread(
          serverId,
          threadId2,
          messageContent3,
        );
      case 'archive_thread':
        const threadId3 = msg.fields.find(
          (field: any) => field.key === 'thread_id',
        ).value;

        await this.discordService.archiveThread(serverId, threadId3, true);
      case 'unarchive_thread':
        const threadId4 = msg.fields.find(
          (field: any) => field.key === 'thread_id',
        ).value;

        await this.discordService.archiveThread(serverId, threadId4, false);
      case 'lock_thread':
        const threadId5 = msg.fields.find(
          (field: any) => field.key === 'thread_id',
        ).value;

        await this.discordService.lockThread(serverId, threadId5, true);
      case 'unlock_thread':
        const threadId6 = msg.fields.find(
          (field: any) => field.key === 'thread_id',
        ).value;

        await this.discordService.lockThread(serverId, threadId6, false);
      case 'reply_message':
        const messageId2 = msg.fields.find(
          (field: any) => field.key === 'message_id',
        ).value;
        const messageContent4 = msg.fields.find(
          (field: any) => field.key === 'message',
        ).value;

        await this.discordService.replyToChannelMessage(
          serverId,
          messageId2,
          messageContent4,
        );
      case 'react_to_message':
        const messageId3 = msg.fields.find(
          (field: any) => field.key === 'message_id',
        ).value;
        const reaction = msg.fields.find(
          (field: any) => field.key === 'reaction',
        ).value;

        await this.discordService.sendReactionToChannelMessage(
          serverId,
          messageId3,
          reaction,
        );
      case 'publish_message':
        const messageId4 = msg.fields.find(
          (field: any) => field.key === 'message_id',
        ).value;

        await this.discordService.publishMessage(serverId, messageId4);
      case 'add_member_to_thread':
        const threadId7 = msg.fields.find(
          (field: any) => field.key === 'thread_id',
        ).value;
        const userId3 = msg.fields.find(
          (field: any) => field.key === 'user_id',
        ).value;

        await this.discordService.addMemberToThread(
          serverId,
          threadId7,
          userId3,
        );
      case 'remove_member_from_thread':
        const threadId8 = msg.fields.find(
          (field: any) => field.key === 'thread_id',
        ).value;
        const userId4 = msg.fields.find(
          (field: any) => field.key === 'user_id',
        ).value;

        await this.discordService.removeMemberFromThread(
          serverId,
          threadId8,
          userId4,
        );
      case 'delete_message':
        const messageId5 = msg.fields.find(
          (field: any) => field.key === 'message_id',
        ).value;

        await this.discordService.deleteMessage(serverId, messageId5);
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
