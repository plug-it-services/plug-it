import { Injectable, Logger } from '@nestjs/common';
import {
  ChannelType,
  Client,
  AnyThreadChannel,
  PublicThreadChannel,
  ThreadChannel,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordService {
  public token: string;
  private client: Client;
  private logger = new Logger(DiscordService.name);

  constructor(private configService: ConfigService) {
    this.token = this.configService.getOrThrow<string>('DISCORD_TOKEN');
    this.client = new Client({
      intents: ['Guilds'],
    });

    this.client.on('ready', async () => {
      this.logger.log('Bot Online!');
    });

    this.client.login(this.token);
  }

  async sendPrivateMessage(userId: string, message: string): Promise<void> {
    const user = await this.client.users.fetch(userId);
    user.send(message);
  }

  async sendChannelMessage(
    serverId: string,
    channelId: string,
    message: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(serverId);
    const channel = guild.channels.cache.get(channelId);
    if (
      channel &&
      (channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement)
    ) {
      await channel.send(message);
    } else {
      this.logger.error(`Channel ${channelId} not found`);
    }
  }

  async disconnectFromServer(serverId: string): Promise<void> {
    const guild = await this.client.guilds.fetch(serverId);
    await guild.leave();
  }

  async createPublicThread(
    serverId: string,
    messageId: string,
    name: string,
    reason?: string,
    autoArchiveDuration?: number,
    rateLimitPerUser?: number,
  ): Promise<PublicThreadChannel | undefined> {
    const guild = await this.client.guilds.fetch(serverId);

    guild.channels.cache.forEach(async (channel) => {
      if (channel.type === ChannelType.GuildText) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          return await message.startThread({
            name,
            reason,
            autoArchiveDuration,
            rateLimitPerUser,
          });
        }
      }
    });
    return;
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

    if (channel && channel.type === ChannelType.GuildText) {
      return await channel.threads.create({
        name,
        reason,
        autoArchiveDuration,
        rateLimitPerUser,
        type: ChannelType.PrivateThread,
      });
    }
    return;
  }

  private async getThread(
    serverId: string,
    threadId: string,
  ): Promise<AnyThreadChannel | undefined> {
    const guild = await this.client.guilds.fetch(serverId);

    guild.channels.cache.forEach(async (channel) => {
      if (channel.type === ChannelType.GuildText) {
        const thread = await channel.threads.fetch(threadId);
        if (thread) {
          return thread;
        }
      }
    });
    return;
  }

  async deleteThread(serverId: string, threadId: string): Promise<void> {
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.delete();
    }
  }

  async deleteMessage(serverId: string, messageId: string): Promise<void> {
    const guild = await this.client.guilds.fetch(serverId);

    guild.channels.cache.forEach(async (channel) => {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement
      ) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          await message.delete();
        }
      }
    });
  }

  async sendMessageInThread(
    serverId: string,
    threadId: string,
    message: string,
  ): Promise<void> {
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.send(message);
    }
  }

  async archiveThread(
    serverId: string,
    threadId: string,
    archive: boolean,
  ): Promise<void> {
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.setArchived(archive);
    }
  }

  async lockThread(
    serverId: string,
    threadId: string,
    lock: boolean,
  ): Promise<void> {
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.setLocked(lock);
    }
  }

  async replyToChannelMessage(
    serverId: string,
    messageId: string,
    content: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(serverId);

    guild.channels.cache.forEach(async (channel) => {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement
      ) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          await message.reply(content);
        }
      }
    });
  }

  async addMemberToThread(
    serverId: string,
    threadId: string,
    userId: string,
  ): Promise<void> {
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.members.add(userId);
    }
  }

  async removeMemberFromThread(
    serverId: string,
    threadId: string,
    userId: string,
  ): Promise<void> {
    const thread = await this.getThread(serverId, threadId);
    if (thread) {
      await thread.members.remove(userId);
    }
  }

  async sendReactionToChannelMessage(
    serverId: string,
    messageId: string,
    reaction: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(serverId);

    guild.channels.cache.forEach(async (channel) => {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement
      ) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          await message.react(reaction);
        }
      }
    });
  }

  async publishMessage(serverId: string, messageId: string): Promise<void> {
    const guild = await this.client.guilds.fetch(serverId);

    guild.channels.cache.forEach(async (channel) => {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement
      ) {
        const message = await channel.messages.fetch(messageId);
        if (message) {
          await message.crosspost();
        }
      }
    });
  }
}
