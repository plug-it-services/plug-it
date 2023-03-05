import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { Controller, Logger } from '@nestjs/common';
import { AmqpService } from './amqp/amqp.service';
import { DiscordService } from './discord/discord.service';
import { DiscordAuthService } from './discord/discordAuth.service';
import { DiscordCommandService } from './discord/discordCommand.service';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    private discordService: DiscordService,
    private discordAuthService: DiscordAuthService,
    private readonly amqpService: AmqpService,
    private discordCommandService: DiscordCommandService,
  ) {}

  @RabbitSubscribe({
    queue: 'plug_action_discord_triggers',
  })
  async triggerAction(msg: any) {
    this.logger.log(`Received event trigger: ${JSON.stringify(msg)}`);
    try {
      const { actionId, userId, plugId, runId } = msg;
      const { serverId } = await this.discordAuthService.retrieveByUserId(
        userId,
      );
      let variables = [];

      switch (actionId) {
        case 'pm':
          const messageContent = msg.fields.find(
            (field: any) => field.key === 'content',
          ).value;
          const userId2 = msg.fields.find(
            (field: any) => field.key === 'id',
          ).value;

          const message = await this.discordService.sendPrivateMessage(
            userId2,
            messageContent,
          );
          variables = [
            {
              key: 'message_id',
              value: message.id,
            },
          ];
          break;
        case 'channel_message':
          const messageContent2 = msg.fields.find(
            (field: any) => field.key === 'content',
          ).value;
          const channelId = msg.fields.find(
            (field: any) => field.key === 'id',
          ).value;

          const message2 = await this.discordService.sendChannelMessage(
            serverId,
            channelId,
            messageContent2,
          );
          variables = [
            {
              key: 'message_id',
              value: message2.id,
            },
          ];
          break;
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

          const thread = await this.discordService.createPublicThread(
            serverId,
            messageId,
            name,
            reason,
            auto_archive_duration,
            rate_limit_per_user,
          );

          variables = [
            {
              key: 'thread_id',
              value: thread.id,
            },
          ];
          break;
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

          const thread2 = await this.discordService.createPrivateThread(
            serverId,
            channelId2,
            name2,
            auto_archive_duration2,
            rate_limit_per_user2,
          );

          variables = [
            {
              key: 'thread_id',
              value: thread2.id,
            },
          ];
          break;

        case 'thread_delete':
          const threadId = msg.fields.find(
            (field: any) => field.key === 'thread_id',
          ).value;

          await this.discordService.deleteThread(serverId, threadId);
          break;
        case 'send_message_thread':
          const threadId2 = msg.fields.find(
            (field: any) => field.key === 'thread_id',
          ).value;
          const messageContent3 = msg.fields.find(
            (field: any) => field.key === 'message',
          ).value;

          const message3 = await this.discordService.sendMessageInThread(
            serverId,
            threadId2,
            messageContent3,
          );
          variables = [
            {
              key: 'message_id',
              value: message3.id,
            },
          ];
          break;
        case 'archive_thread':
          const threadId3 = msg.fields.find(
            (field: any) => field.key === 'thread_id',
          ).value;

          await this.discordService.archiveThread(serverId, threadId3, true);
          break;
        case 'unarchive_thread':
          const threadId4 = msg.fields.find(
            (field: any) => field.key === 'thread_id',
          ).value;

          await this.discordService.archiveThread(serverId, threadId4, false);
          break;
        case 'lock_thread':
          const threadId5 = msg.fields.find(
            (field: any) => field.key === 'thread_id',
          ).value;

          await this.discordService.lockThread(serverId, threadId5, true);
          break;
        case 'unlock_thread':
          const threadId6 = msg.fields.find(
            (field: any) => field.key === 'thread_id',
          ).value;

          await this.discordService.lockThread(serverId, threadId6, false);
          break;
        case 'reply_message':
          const messageId2 = msg.fields.find(
            (field: any) => field.key === 'message_id',
          ).value;
          const messageContent4 = msg.fields.find(
            (field: any) => field.key === 'message',
          ).value;

          const message4 = await this.discordService.replyToChannelMessage(
            serverId,
            messageId2,
            messageContent4,
          );
          variables = [
            {
              key: 'message_id',
              value: message4.id,
            },
          ];
          break;
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
          break;
        case 'publish_message':
          const messageId4 = msg.fields.find(
            (field: any) => field.key === 'message_id',
          ).value;

          await this.discordService.publishMessage(serverId, messageId4);
          break;
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
          break;
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
          break;
        case 'delete_message':
          const messageId5 = msg.fields.find(
            (field: any) => field.key === 'message_id',
          ).value;

          await this.discordService.deleteMessage(serverId, messageId5);
          break;
      }
      await this.amqpService.publishAction(
        actionId,
        plugId,
        runId,
        userId,
        variables,
      );
    } catch (err) {
      console.error(err);
      this.logger.log("Can't execute an action in discord", err);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    queue: 'plug_event_discord_initialize',
  })
  async listenForEvents(msg: any) {
    try {
      this.logger.log(`Received event initialize: ${JSON.stringify(msg)}`);
      const { plugId, userId, eventId } = msg;
      const user = await this.discordAuthService.retrieveByUserId(userId);
      if (!user) {
        this.logger.log(`User ${userId} not found`);
        return new Nack(false);
      }

      switch (eventId) {
        case 'command':
          const command = msg.fields.find(
            (field: any) => field.key === 'command',
          ).value;

          await this.discordCommandService.registerCommand(
            userId,
            plugId,
            command,
            user.serverId!,
          );
          break;
      }
    } catch (e) {
      this.logger.error(`Error while initializing event : ${e}`);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    queue: 'plug_event_discord_disabled',
  })
  async disableEvent(msg: any) {
    try {
      this.logger.log(`Received event disable: ${JSON.stringify(msg)}`);
      const { plugId, userId, eventId } = msg;
      await this.discordCommandService.deleteCommand(plugId);
    } catch (e) {
      this.logger.error(`Error while disabling event : ${e}`);
      return new Nack(false);
    }
  }
}
