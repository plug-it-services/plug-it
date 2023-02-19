import { Injectable, Logger } from '@nestjs/common';
import { ChannelType, Client, Guild } from 'discord.js';
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

  async sendChannelMessage(channelId: string, message: string): Promise<void> {
    const channel = this.client.channels.cache.get(channelId);
    if (
      channel &&
      (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement)
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

  async getLatestJoinedServer(): Promise<Guild | undefined> {
    return this.client.guilds.cache.last();
  }
}
