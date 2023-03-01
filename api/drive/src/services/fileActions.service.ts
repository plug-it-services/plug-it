import { Injectable, Logger } from '@nestjs/common';
import { WebHookService } from './webhook.service';
import { DriveAuthService } from './driveAuth.service';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export default class FileActionsService {
  private logger = new Logger(WebHookService.name);

  constructor(
    private driveAuthService: DriveAuthService,
    private webhookService: WebHookService,
    private configService: ConfigService,
  ) {}

  async createFile(userId: number, plugId: string, name: string) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    // TODO rendre des variables depuis le file créé
  }

  async deleteFile(userId: number, plugId: string, fileId: string) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    await drive.files.delete({
      fileId,
    });
  }

  async renameFile(
    userId: number,
    plugId: string,
    fileId: string,
    name: string,
  ) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    const fileMetadata = {
      name,
    };

    const file = await drive.files.update({
      fileId,
      requestBody: fileMetadata,
    });
  }

  async moveFile(
    userId: number,
    plugId: string,
    fileId: string,
    destinationId: string,
  ) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    const fileMetadata = {
      parents: [destinationId],
    };

    const file = await drive.files.update({
      fileId,
      requestBody: fileMetadata,
    });
  }

  async copyFile(
    userId: number,
    plugId: string,
    fileId: string,
    destinationId: string,
  ) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    const fileMetadata = {
      parents: [destinationId],
    };

    const file = await drive.files.copy({
      fileId,
      requestBody: fileMetadata,
    });
  }

  async shareFile(
    userId: number,
    plugId: string,
    fileId: string,
    email: string,
    role: string,
  ) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    const permission = {
      type: 'user',
      role,
      emailAddress: email,
    };

    const perm = await drive.permissions.create({
      fileId,
      requestBody: permission,
    });

    // TODO rendre des variables depuis le perm créé
  }

  async unshareFile(
    userId: number,
    plugId: string,
    fileId: string,
    permissionId: string,
  ) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    await drive.permissions.delete({
      fileId,
      permissionId,
    });
  }

  async changeFilePermission(
    userId: number,
    plugId: string,
    fileId: string,
    permissionId: string,
    role: string,
  ) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    const permission = {
      role,
    };

    const perm = await drive.permissions.update({
      fileId,
      permissionId,
      requestBody: permission,
    });

    // TODO rendre des variables depuis le perm créé
  }

  async createFolder(userId: number, plugId: string, name: string) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    // TODO rendre des variables depuis le file créé
  }

  async deleteFolder(userId: number, plugId: string, folderId: string) {
    await this.deleteFile(userId, plugId, folderId);
  }

  async renameFolder(
    userId: number,
    plugId: string,
    folderId: string,
    name: string,
  ) {
    await this.renameFile(userId, plugId, folderId, name);
  }

  async moveFolder(
    userId: number,
    plugId: string,
    folderId: string,
    destinationId: string,
  ) {
    await this.moveFile(userId, plugId, folderId, destinationId);
  }

  async copyFolder(
    userId: number,
    plugId: string,
    folderId: string,
    destinationId: string,
  ) {
    await this.copyFile(userId, plugId, folderId, destinationId);
  }

  async shareFolder(
    userId: number,
    plugId: string,
    folderId: string,
    email: string,
    role: string,
  ) {
    await this.shareFile(userId, plugId, folderId, email, role);
  }

  async unshareFolder(
    userId: number,
    plugId: string,
    folderId: string,
    permissionId: string,
  ) {
    await this.unshareFile(userId, plugId, folderId, permissionId);
  }

  async changeFolderPermission(
    userId: number,
    plugId: string,
    folderId: string,
    permissionId: string,
    role: string,
  ) {
    await this.changeFilePermission(
      userId,
      plugId,
      folderId,
      permissionId,
      role,
    );
  }

  async getFile(userId: number, plugId: string, fileId: string) {
    const drive = google.drive({
      version: 'v3',
      auth: await this.driveAuthService.getLoggedClient(userId),
    });

    const file = await drive.files.get({
      fileId,
      fields: '*',
    });
  }

  async getFolder(userId: number, plugId: string, folderId: string) {
    await this.getFile(userId, plugId, folderId);
  }
}
