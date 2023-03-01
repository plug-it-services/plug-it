import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { DriveAuthService } from './driveAuth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriveChangesWebhookEntity } from '../schemas/driveChangesWebhook.entity';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class DriveChangesService {
  constructor(
    private driveAuthService: DriveAuthService,
    @InjectRepository(DriveChangesWebhookEntity)
    private driveChangesRepository: Repository<DriveChangesWebhookEntity>,
    private configService: ConfigService,
  ) {}

  private async saveRegisteredWebhook(
    webhookId: string,
    userId: number,
    plugId: string,
  ) {
    const webhook: DriveChangesWebhookEntity = {
      id: webhookId,
      userId,
      plugId,
    };
    await this.driveChangesRepository.save(webhook);
  }

  private async getWebhookById(id: string) {
    return this.driveChangesRepository.findOneBy({ id });
  }

  private async deleteWebhookById(id: string) {
    return this.driveChangesRepository.delete({ id });
  }

  private generateWebhookId() {
    return uuidv4();
  }

  async setupWebhookOnMyDrive(userId: number, plugId: string) {
    const oauth2Client = await this.driveAuthService.getLoggedClient(userId);

    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });

    const token = await drive.changes.getStartPageToken();
    const webhookId = this.generateWebhookId();

    await this.saveRegisteredWebhook(webhookId, userId, plugId);

    const webhook = await drive.changes.watch({
      pageToken: token.data.startPageToken,
      requestBody: {
        id: webhookId,
        type: 'web_hook',
        address:
          this.configService.getOrThrow('WEBHOOK_BASE_URL') + `/${webhookId}`,
      },
    });
  }
}
