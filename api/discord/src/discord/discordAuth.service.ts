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
    } else {
      await this.discordAuthRepository.save({
        id: state,
        userId,
        redirectUrl,
        serverId,
      });
    }
    return state;
  }

  async retrieveByState(state: string) {
    return this.discordAuthRepository.findOneBy({ id: state });
  }

  async retrieveByUserId(userId: number) {
    return this.discordAuthRepository.findOneBy({ userId });
  }
}
