import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { GithubAuthEntity } from '../schemas/githubAuth.entity';
import axios from 'axios';

@Injectable()
export class GithubAuthService {
  private clientId: string;
  private clientSecret: string;
  private callbackUrl: string;
  private logger = new Logger(GithubAuthService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(GithubAuthEntity)
    private githubAuthRepository: Repository<GithubAuthEntity>,
  ) {
    this.clientId = this.configService.getOrThrow<string>('CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>('CLIENT_SECRET');
    this.callbackUrl = this.configService.getOrThrow<string>('OAUTH2_CALLBACK');
  }

  private async saveState(userId: number, redirectUrl: string) {
    const state = uuidv4();
    const exists = await this.githubAuthRepository.findOneBy({ userId });

    if (exists) {
      await this.githubAuthRepository.update(
        { userId },
        {
          id: state,
          redirectUrl,
        },
      );
    } else {
      await this.githubAuthRepository.save({
        id: state,
        userId,
        redirectUrl,
      });
    }
    return state;
  }

  private async retrieveByState(state: string) {
    return this.githubAuthRepository.findOneBy({ id: state });
  }

  private base64URLEncode(str: Buffer) {
    return str
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private async buildUrl(state: string) {
    const url = new URL('https://github.com/login/oauth/authorize');

    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', this.callbackUrl);
    url.searchParams.append('scope', 'user:read read:user repo admin:org_hook admin:org admin:repo_hook');
    url.searchParams.append('state', state);
    return url.toString();
  }

  async getAuthUrl(userId: number, redirectUrl: string) {
    const state = await this.saveState(userId, redirectUrl);
    return this.buildUrl(state);
  }

  private async fetchAccessToken(code: string) {
    const url = new URL('https://github.com/login/oauth/access_token');

    url.searchParams.append('grant_type', 'authorization_code');
    url.searchParams.append('code', code);
    url.searchParams.append(
      'client_id',
      this.configService.getOrThrow<string>('CLIENT_ID'),
    );
    url.searchParams.append(
      'client_secret',
      this.configService.getOrThrow<string>('CLIENT_SECRET'),
    );
    url.searchParams.append(
      'redirect_uri',
      this.configService.getOrThrow<string>('OAUTH2_CALLBACK'),
    );
    const response = await axios.post(
      url.toString(),
      {},
      { headers: { Accept: 'application/json' } },
    );
    if (response.data.error) {
      throw new Error(response.data.error_description);
    }
    return response;
  }

  async storeAccessToken(state: string, code: string) {
    const auth = await this.retrieveByState(state);
    try {
      const response = await this.fetchAccessToken(code);
      await this.githubAuthRepository.update(
        { id: state },
        {
          accessToken: response.data.access_token,
        },
      );
      return { userId: auth.userId, redirectUrl: auth.redirectUrl };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  private async updateAccessToken(auth: GithubAuthEntity) {
    /*
    const url = new URL('https://api.github.com/2/oauth2/token');

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
    await this.githubAuthRepository.save(auth);
    return auth.accessToken;
    */
  }

  async getAccessToken(userId: number) {
    const auth = await this.githubAuthRepository.findOneBy({ userId });

    if (!auth) {
      return null;
    }
    /*
    if (auth.expiresAt <= Date.now() + 10000) {
      // if token is about to expire (10 seconds)
      return this.updateAccessToken(auth);
    }
    */
    return auth.accessToken;
  }

  async disconnect(userId: number) {
    /*
    const auth = await this.githubAuthRepository.findOneBy({ userId });
    if (!auth) {
      return;
    }
    const url = new URL('https://api.github.com/2/oauth2/revoke');

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
     */
    await this.githubAuthRepository.delete({ userId });
  }
}
