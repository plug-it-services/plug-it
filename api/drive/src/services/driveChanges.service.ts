import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { DriveAuthService } from './driveAuth.service';
import { ConfigService } from '@nestjs/config';
import { WebHookService } from './webhook.service';

@Injectable()
export default class DriveChangesService {
  private logger = new Logger(WebHookService.name);

  constructor(
    private driveAuthService: DriveAuthService,
    private webhookService: WebHookService,
    private configService: ConfigService,
  ) {}

  async setupWebhookOnMyDrive(userId: number, plugId: string) {
    const oauth2Client = await this.driveAuthService.getLoggedClient(userId);

    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });

    const token = await drive.changes.getStartPageToken();
    const webhookId = this.webhookService.generateWebhookId();

    await this.webhookService.create(
      webhookId,
      userId,
      plugId,
      'changesOnMyDrive',
    );

    this.logger.log(
      `Creating webhook to watch changes on ${userId} user's drive`,
    );
    await drive.changes.watch({
      pageToken: token.data.startPageToken,
      requestBody: {
        id: webhookId,
        type: 'web_hook',
        address:
          this.configService.getOrThrow('WEBHOOK_BASE_URL') + `/${webhookId}`,
      },
    });
    this.logger.log(`Created webhook for user ${userId}`);
  }

  async setupWebhookOnFile(userId: number, plugId: string, fileId: string) {
    const oauth2Client = await this.driveAuthService.getLoggedClient(userId);
    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });
    const webhookId = this.webhookService.generateWebhookId();

    await this.webhookService.create(
      webhookId,
      userId,
      plugId,
      'changesOnMyDrive',
    );
    this.logger.log(
      `Creating webhook to watch ${fileId} file changes for user ${userId}`,
    );
    await drive.files.watch({
      fileId,
      requestBody: {
        id: webhookId,
        type: 'web_hook',
        address:
          this.configService.getOrThrow('WEBHOOK_BASE_URL') + `/${webhookId}`,
      },
    });
    this.logger.log(`Created webhook for user ${userId}`);
  }

  async stopWebhook(userId: number, plugId: string, eventId: string) {
    const webhook = await this.webhookService.find(userId, plugId, eventId);

    if (!webhook) {
      this.logger.log(
        `Webhook not found for user ${userId} that should be stopped`,
      );
      return;
    }
    const { uuid } = webhook;
    const oauth2Client = await this.driveAuthService.getLoggedClient(userId);
    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });
    this.logger.log(`Stopping webhook ${uuid} for user ${userId}`);
    drive.channels.stop({
      requestBody: {
        id: uuid,
      },
    });
    this.logger.log(`Stopped webhook ${uuid} for user ${userId}`);
  }
}
