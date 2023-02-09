import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebHookEntity } from '../entities/webhook.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WebHookService {
  private logger = new Logger(WebHookService.name);

  constructor(
    @InjectRepository(WebHookEntity)
    private webhookRepository: Repository<WebHookEntity>,
  ) {}

  async getWebhookById(uuid: string): Promise<WebHookEntity | null> {
    return this.webhookRepository.findOneBy({ uuid });
  }

  async create(uuid: string, uid: number): Promise<WebHookEntity> {
    this.logger.log(`Creating webhook for user ${uid}`);
    return this.webhookRepository.save({
      uuid,
      uid,
    });
  }

  async delete(uuid: string) {
    await this.webhookRepository.delete({ uuid });
  }
}
