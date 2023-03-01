import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { DriveAuthService } from './driveAuth.service';

@Injectable()
export default class DriveChangesService {
  constructor(
    private driveAuthService: DriveAuthService,
  ) {}

  async setupWebhookOnMyDrive(userId: number) {
    const oauth2Client = await this.driveAuthService.getLoggedClient(userId);

    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });

    const token = await drive.changes.getStartPageToken();

    const webhook = await drive.changes.watch({
      pageToken: token.data.startPageToken,
      requestBody: {
        id: 'plug',
        type: 'web_hook',
        address: 'https://plug.alexandria.io/api/drive/listen',
      },
    });
  }
}