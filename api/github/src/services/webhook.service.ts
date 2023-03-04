import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebHookEntity } from '../schemas/webhook.entity';
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

  async find(plugId: string) {
    return this.webhookRepository.findOneBy({
      plugId,
    });
  }
  async findByUuiD(uuid: string) {
    return this.webhookRepository.findOneBy({
      uuid,
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

  async deleteById(plugId: string) {
    await this.webhookRepository.delete({ plugId: plugId });
  }
}
