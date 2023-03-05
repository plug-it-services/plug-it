import { Injectable, Logger } from '@nestjs/common';
import {
  ChannelType,
  Client,
  AnyThreadChannel,
  ThreadChannel,
  Message,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { DiscordCommandService } from './discordCommand.service';
import { AmqpService } from '../amqp/amqp.service';

@Injectable()
export class DiscordService {
  public token: string;
  private client: Client;
  private logger = new Logger(DiscordService.name);

  constructor(
    private configService: ConfigService,
    private discordCommandService: DiscordCommandService,
    private amqpService: AmqpService,
  ) {
    this.token = this.configService.getOrThrow<string>('DISCORD_TOKEN');
    this.client = new Client({
      intents: ['Guilds', 'GuildMessages', 'MessageContent'],
    });

    this.client.on('ready', async () => {
      this.logger.log('Bot Online!');
    });

    this.client.on('messageCreate', async (message) => {
      try {
        if (
          message.author.bot ||
          !message.guild ||
          message.channel.type === ChannelType.DM
        ) {
          return;
        }
        this.logger.log(
          `new message from ${message.author.id} with content ${message.content}`,
        );

        const commands = await this.discordCommandService.findByServerId(
          message.guild.id,
        );
        for (const { command, userId, plugId } of commands) {
          if (message.content == `!${command}`) {
            const variables = [
              {
                key: 'message_id',
                value: message.id,
              },
              {
                key: 'author_id',
                value: message.author.id,
              },
            ];

            await this.amqpService.publishEvent(
              'plugs_events',
              'command',
              plugId,
              userId,
              variables,
            );
            this.logger.log(`Published command for ${userId}`);
          }
        }
      } catch (e) {
        this.logger.error(
          `Error when looking into this message ${JSON.stringify(message)}`,
        );
      }
    });

    this.client.login(this.token);
  }

  async sendPrivateMessage(
    userId: string,
    content: string,
  ): Promise<Message | undefined> {
    const user = await this.client.users.fetch(userId);
    const message = await user.send(content);
    this.logger.log(
      `Sent a private message to ${userId} (${user.tag}) with ${content}`,
    );
    return message;
  }

  async sendChannelMessage(
    serverId: string,
    channelId: string,
    content: string,
  ): Promise<Message | undefined> {
    const guild = await this.client.guilds.fetch(serverId);
    const channel = guild.channels.cache.get(channelId);
    if (
      channel &&
      (channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement)
    ) {
      const message = await channel.send(content);
      this.logger.log(`Sent a message to channel ${channelId} with ${content}`);
      return message;
    } else {
      this.logger.error(`Channel ${channelId} not found`);
    }
  }

  async disconnectFromServer(serverId: string): Promise<void> {
    const guild = await this.client.guilds.fetch(serverId);
    await guild.leave();
    this.logger.log(`Disconnected from server ${serverId}`);
  }

  async createPublicThread(
    serverId: string,
    messageId: string,
    name: string,
    reason?: string,
    autoArchiveDuration?: number,
    rateLimitPerUser?: number,
  ): Promise<AnyThreadChannel | undefined> {
    const guild = await this.client.guilds.fetch(serverId);

    for (const [, channel] of guild.channels.cache) {
      if (channel.type === ChannelType.GuildText) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          this.logger.log(
            `Try to create a public thread for the message ${message.id}`,
          );
          const thread = await message.startThread({
            name,
            reason,
            autoArchiveDuration,
            rateLimitPerUser,
          });
          this.logger.log(`Created a new public thread with id: ${thread.id}`);
          return thread;
        }
      }
    }
  }

  async createPrivateThread(
    serverId: string,
    channelId: string,
    name: string,
    reason?: string,
    autoArchiveDuration?: number,
    rateLimitPerUser?: number,
  ): Promise<ThreadChannel | undefined> {
    const guild = await this.client.guilds.fetch(serverId);
    const channel = guild.channels.cache.get(channelId);
    let thread: ThreadChannel | undefined;

    if (channel && channel.type === ChannelType.GuildText) {
      this.logger.log(
        `Try to create a private thread for the channel ${channelId}`,
      );
      thread = await channel.threads.create({
        name,
        reason,
        autoArchiveDuration,
        rateLimitPerUser,
        type: ChannelType.PrivateThread,
      });
      this.logger.log(`Created a new private thread with id: ${thread.id}`);
    }
    return thread;
  }

  private async getThread(
    serverId: string,
    threadId: string,
  ): Promise<AnyThreadChannel | undefined> {
    const guild = await this.client.guilds.fetch(serverId);

    for (const [, channel] of guild.channels.cache) {
      if (channel.type === ChannelType.GuildText) {
        const thread = await channel.threads.fetch(threadId);
        if (thread) {
          return thread;
        }
      }
    }
  }

  async deleteThread(serverId: string, threadId: string): Promise<void> {
    this.logger.log(`Try to delete thread ${threadId} from server ${serverId}`);
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.delete();
      this.logger.log(`Deleted thread ${threadId} from server ${serverId}`);
    }
  }

  async deleteMessage(serverId: string, messageId: string): Promise<void> {
    const guild = await this.client.guilds.fetch(serverId);

    this.logger.log(`Try to delete message ${messageId}`);
    for (const [, channel] of guild.channels.cache) {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement
      ) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          await message.delete();
          this.logger.log(`Deleted message ${messageId}`);
          return;
        }
      }
    }
  }

  async sendMessageInThread(
    serverId: string,
    threadId: string,
    content: string,
  ): Promise<Message | undefined> {
    this.logger.log(
      `Try to send a message in thread ${threadId} from server ${serverId}`,
    );
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      const message = await thread.send(content);
      this.logger.log(
        `Sent a message in thread ${threadId} from server ${serverId} with content ${message}`,
      );
      return message;
    }
  }

  async archiveThread(
    serverId: string,
    threadId: string,
    archive: boolean,
  ): Promise<void> {
    this.logger.log(
      `Try to archive thread ${threadId} from server ${serverId}`,
    );
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.setArchived(archive);
      this.logger.log(`Archived thread ${threadId} from server ${serverId}`);
    }
  }

  async lockThread(
    serverId: string,
    threadId: string,
    lock: boolean,
  ): Promise<void> {
    this.logger.log(`Try to lock thread ${threadId} from server ${serverId}`);
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.setLocked(lock);
      this.logger.log(`Locked thread ${threadId} from server ${serverId}`);
    }
  }

  async replyToChannelMessage(
    serverId: string,
    messageId: string,
    content: string,
  ): Promise<Message | undefined> {
    this.logger.log(
      `Try to reply to message ${messageId} from server ${serverId}`,
    );
    const guild = await this.client.guilds.fetch(serverId);

    for (const [, channel] of guild.channels.cache) {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement
      ) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          const newMessage = await message.reply(content);
          this.logger.log(
            `Replied to message ${messageId} from server ${serverId} with content ${newMessage}`,
          );
          return newMessage;
        }
      }
    }
  }

  async addMemberToThread(
    serverId: string,
    threadId: string,
    userId: string,
  ): Promise<void> {
    this.logger.log(
      `Try to add member ${userId} to thread ${threadId} from server ${serverId}`,
    );
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.members.add(userId);
      this.logger.log(
        `Added member ${userId} to thread ${threadId} from server ${serverId}`,
      );
    }
  }

  async removeMemberFromThread(
    serverId: string,
    threadId: string,
    userId: string,
  ): Promise<void> {
    this.logger.log(
      `Try to remove member ${userId} from thread ${threadId} from server ${serverId}`,
    );
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.members.remove(userId);
      this.logger.log(
        `Removed member ${userId} from thread ${threadId} from server ${serverId}`,
      );
    }
  }

  async sendReactionToChannelMessage(
    serverId: string,
    messageId: string,
    reaction: string,
  ): Promise<void> {
    this.logger.log(
      `Try to send reaction ${reaction} to message ${messageId} from server ${serverId}`,
    );
    const guild = await this.client.guilds.fetch(serverId);

    for (const [, channel] of guild.channels.cache) {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement
      ) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          await message.react(reaction);
          this.logger.log(
            `Sent reaction ${reaction} to message ${messageId} from server ${serverId}`,
          );
          return;
        }
      }
    }
  }

  async publishMessage(serverId: string, messageId: string): Promise<void> {
    this.logger.log(
      `Try to publish message ${messageId} from server ${serverId}`,
    );
    const guild = await this.client.guilds.fetch(serverId);

    for (const [, channel] of guild.channels.cache) {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement
      ) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          await message.crosspost();
          this.logger.log(
            `Published message ${messageId} from server ${serverId}`,
          );
          return;
        }
      }
    }
  }
}
