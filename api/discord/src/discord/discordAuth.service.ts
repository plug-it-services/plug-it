import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscordAuthEntity } from '../entities/discordAuth.entity';

@Injectable()
export class DiscordAuthService {
  private logger = new Logger(DiscordAuthService.name);

  constructor(
    @InjectRepository(DiscordAuthEntity)
    private discordAuthRepository: Repository<DiscordAuthEntity>,
  ) {}

  async saveState(
    userId: number,
    redirectUrl: string,
    state: string,
    serverId?: string,
  ) {
    const exists = await this.discordAuthRepository.findOneBy({ userId });

    if (exists) {
      await this.discordAuthRepository.update(
        { userId },
        {
          id: state,
          redirectUrl,
          serverId,
        },
      );
      this.logger.log(`Updated discord auth for user ${userId}`);
    } else {
      await this.discordAuthRepository.save({
        id: state,
        userId,
        redirectUrl,
        serverId,
      });
      this.logger.log(`Saved discord auth for user ${userId}`);
    }
    return state;
  }

  async retrieveByState(state: string): Promise<DiscordAuthEntity | null> {
    return this.discordAuthRepository.findOneBy({ id: state });
  }

  async retrieveByUserId(userId: number): Promise<DiscordAuthEntity | null> {
    return this.discordAuthRepository.findOneBy({ userId });
  }

  async deleteByServerId(serverId: string) {
    await this.discordAuthRepository.delete({ serverId });
    this.logger.log(`Deleted discord auth for server ${serverId}`);
  }
}
