import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { TwitterAuthEntity } from '../schemas/twitterAuth.entity';
import axios from 'axios';

@Injectable()
export class TwitterAuthService {
  private clientId: string;
  private clientSecret: string;
  private callbackUrl: string;
  private logger = new Logger(TwitterAuthService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(TwitterAuthEntity)
    private twitterAuthRepository: Repository<TwitterAuthEntity>,
  ) {
    this.clientId = this.configService.getOrThrow<string>('CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>('CLIENT_SECRET');
    this.callbackUrl = this.configService.getOrThrow<string>('OAUTH2_CALLBACK');
  }

  private async saveState(
    userId: number,
    redirectUrl: string,
    codeChallenge: string,
  ) {
    const state = uuidv4();
    const exists = await this.twitterAuthRepository.findOneBy({ userId });

    if (exists) {
      await this.twitterAuthRepository.update(
        { userId },
        {
          id: state,
          redirectUrl,
          codeChallenge,
        },
      );
    } else {
      await this.twitterAuthRepository.save({
        id: state,
        userId,
        redirectUrl,
        codeChallenge,
      });
    }
    return state;
  }

  private async retrieveByState(state: string) {
    return this.twitterAuthRepository.findOneBy({ id: state });
  }

  private sha256(buffer: string) {
    return crypto.createHash('sha256').update(buffer).digest();
  }

  private base64URLEncode(str: Buffer) {
    return str
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private async buildUrl(
    state: string,
    codeVerifier: string,
  ) {
    const codeChallenge = this.base64URLEncode(this.sha256(codeVerifier));
    const url = new URL('https://twitter.com/i/oauth2/authorize');

    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', this.callbackUrl);
    url.searchParams.append(
      'scope',
      'tweet.read tweet.write users.read offline.access',
    );
    url.searchParams.append('state', state);
    url.searchParams.append('code_challenge', codeChallenge);
    url.searchParams.append('code_challenge_method', 's256');
    return url.toString();
  }

  async getAuthUrl(userId: number, redirectUrl: string) {
    const codeVerifier = this.base64URLEncode(crypto.randomBytes(32));
    const state = await this.saveState(userId, redirectUrl, codeVerifier);
    return this.buildUrl(state, codeVerifier);
  }

  private fetchAccessToken(codeVerifier: string, code: string) {
    const url = new URL('https://api.twitter.com/2/oauth2/token');

    url.searchParams.append('grant_type', 'authorization_code');
    url.searchParams.append('code', code);
    url.searchParams.append(
      'client_id',
      this.configService.getOrThrow<string>('CLIENT_ID'),
    );
    url.searchParams.append('code_verifier', codeVerifier);
    url.searchParams.append(
      'redirect_uri',
      this.configService.getOrThrow<string>('OAUTH2_CALLBACK'),
    );
    return axios.post(
      url.toString(),
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }

  async storeAccessToken(state: string, code: string) {
    const auth = await this.retrieveByState(state);
    try {
      const response = await this.fetchAccessToken(auth.codeChallenge, code);
      await this.twitterAuthRepository.update(
        { id: state },
        {
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          expiresAt: Date.now() + response.data.expires_in * 1000,
        },
      );
      return { userId: auth.userId, redirectUrl: auth.redirectUrl };
    } catch (e) {
      console.error(e);
    }
  }

  private async updateAccessToken(auth: TwitterAuthEntity) {
    const url = new URL('https://api.twitter.com/2/oauth2/token');

    url.searchParams.append('grant_type', 'refresh_token');
    url.searchParams.append('refresh_token', auth.refreshToken);
    url.searchParams.append(
      'client_id',
      this.configService.getOrThrow<string>('CLIENT_ID'),
    );
    const response = await axios.post(
      url.toString(),
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    auth.accessToken = response.data.access_token;
    auth.refreshToken = response.data.refresh_token;
    auth.expiresAt = Date.now() + response.data.expires_in * 1000;
    await this.twitterAuthRepository.save(auth);
    return auth.accessToken;
  }

  async getAccessToken(userId: number) {
    const auth = await this.twitterAuthRepository.findOneBy({ userId });

    if (!auth) {
      return null;
    }
    if (auth.expiresAt <= Date.now() + 10000) {
      // if token is about to expire (10 seconds)
      return this.updateAccessToken(auth);
    }
    return auth.accessToken;
  }

  async disconnect(userId: number) {
    const auth = await this.twitterAuthRepository.findOneBy({ userId });
    if (!auth) {
      return;
    }
    const url = new URL('https://api.twitter.com/2/oauth2/revoke');

    url.searchParams.append('token', auth.accessToken);
    url.searchParams.append(
      'client_id',
      this.configService.getOrThrow<string>('CLIENT_ID'),
    );
    url.searchParams.append('token_type_hint', 'access_token');
    try {
      await axios.post(
        url.toString(),
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (e) {
      this.logger.error(`Cannot revoke token for user ${auth.userId}`, e);
    }
    await this.twitterAuthRepository.delete({ userId });
  }
}
