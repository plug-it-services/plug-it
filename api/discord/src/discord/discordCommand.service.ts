import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscordCommandEntity } from '../entities/discordCommand.entity';

@Injectable()
export class DiscordCommandService {
  private logger = new Logger(DiscordCommandService.name);

  constructor(
    @InjectRepository(DiscordCommandEntity)
    private discordCommandRepository: Repository<DiscordCommandEntity>,
  ) {}

  async registerCommand(
    userId: number,
    plugId: string,
    command: string,
    serverId: string,
  ): Promise<void> {
    await this.discordCommandRepository.save({
      userId,
      plugId,
      command,
      serverId,
    });
    this.logger.log(`Saved discord command for user ${userId}`);
  }

  async deleteCommand(plugId: string): Promise<void> {
    await this.discordCommandRepository.delete({ plugId });
    this.logger.log(`Deleted discord command for plug ${plugId}`);
  }

  async deleteAllCommandsByUserId(userId: number): Promise<void> {
    await this.discordCommandRepository.delete({ userId });
    this.logger.log(`Deleted discord commands for user ${userId}`);
  }

  async findByPlugId(plugId: string): Promise<DiscordCommandEntity | null> {
    return await this.discordCommandRepository.findOneBy({ plugId });
  }

  async findByServerId(serverId: string): Promise<DiscordCommandEntity[]> {
    return await this.discordCommandRepository.findBy({ serverId });
  }
}
