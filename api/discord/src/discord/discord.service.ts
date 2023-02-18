import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordService {
  private client: Client;
  private logger = new Logger(DiscordService.name);

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('DISCORD_TOKEN');
    this.client = new Client({
      intents: ['Guilds'],
    });

    this.client.on('ready', async () => {
      this.logger.log('Bot Online!');
    });

    this.client.login(token);
  }

  async sendPrivateMessage(userId: string, message: string): Promise<void> {
    const user = await this.client.users.fetch(userId);
    user.send(message);
  }
}
