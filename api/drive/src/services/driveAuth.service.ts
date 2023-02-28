import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { google } from 'googleapis';
import { DriveAuthEntity } from '../schemas/driveAuth.entity';

@Injectable()
export class DriveAuthService {
  private clientId: string;
  private clientSecret: string;
  private callbackUrl: string;
  private logger = new Logger(DriveAuthService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(DriveAuthEntity)
    private driveAuthRepository: Repository<DriveAuthEntity>,
  ) {
    this.clientId = this.configService.getOrThrow<string>('CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>('CLIENT_SECRET');
    this.callbackUrl = this.configService.getOrThrow<string>('OAUTH2_CALLBACK');
  }

  private async saveState(userId: number, redirectUrl: string) {
    const state = uuidv4();
    const exists = await this.driveAuthRepository.findOneBy({ userId });

    if (exists) {
      await this.driveAuthRepository.update(
        { userId },
        {
          id: state,
          redirectUrl,
        },
      );
    } else {
      await this.driveAuthRepository.save({
        id: state,
        userId,
        redirectUrl,
      });
    }
    return state;
  }

  private async retrieveByState(state: string) {
    return this.driveAuthRepository.findOneBy({ id: state });
  }

  private async buildUrl(state: string) {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.callbackUrl,
    );
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/drive',
      state,
    });
  }

  async getAuthUrl(userId: number, redirectUrl: string) {
    const state = await this.saveState(userId, redirectUrl);
    return this.buildUrl(state);
  }

  private async fetchAccessToken(code: string) {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.callbackUrl,
    );
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }

  async storeAccessToken(state: string, code: string) {
    const auth = await this.retrieveByState(state);
    try {
      const tokens = await this.fetchAccessToken(code);
      await this.driveAuthRepository.update(
        { id: state },
        {
          refreshToken: tokens.refresh_token,
        },
      );
      return { userId: auth.userId, redirectUrl: auth.redirectUrl };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getRefreshToken(userId: number) {
    const auth = await this.driveAuthRepository.findOneBy({ userId });

    if (!auth) {
      return null;
    }
    return auth.refreshToken;
  }

  async disconnect(userId: number) {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.callbackUrl,
    );
    oauth2Client.setCredentials({
      refresh_token: await this.getRefreshToken(userId),
    });

    await oauth2Client.revokeCredentials();
    await this.driveAuthRepository.delete({ userId });
  }
}
