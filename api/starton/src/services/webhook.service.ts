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

  async getWebhookByState(uuid: string): Promise<WebHookEntity | null> {
    return this.webhookRepository.findOneBy({ uuid });
  }

  async find(userId: number, plugId: string, eventId: string) {
    return this.webhookRepository.findOneBy({
      userId,
      plugId,
      eventId,
    });
  }

  async findAllByUserId(userId: number): Promise<WebHookEntity[]> {
    return this.webhookRepository.findBy({ userId });
  }

  async create(
    uuid: string,
    userId: number,
    plugId: string,
    eventId: string,
  ): Promise<WebHookEntity> {
    this.logger.log(`Creating webhook for user ${userId}`);
    return this.webhookRepository.save({
      uuid,
      userId,
      plugId,
      eventId,
    });
  }

  async addWebhookId(uuid: string, webhookId: string) {
    await this.webhookRepository.update({ uuid }, { webhookId });
  }

  async deleteByState(uuid: string) {
    await this.webhookRepository.delete({ uuid });
  }

  async deleteById(webhookId: string) {
    await this.webhookRepository.delete({ webhookId });
  }
}
