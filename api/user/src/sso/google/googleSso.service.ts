import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { SsoService, Profile } from '../sso.service';
import axios from 'axios';

@Injectable()
export class GoogleSsoService implements SsoService {
  private client: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.client = new OAuth2Client(
      configService.get<string>('GOOGLE_CLIENT_ID'),
      configService.get<string>('GOOGLE_CLIENT_SECRET'),
    );
  }

  async getUserProfile(tokenId: string): Promise<Profile> {
    const ticket = await this.client.verifyIdToken({
      idToken: tokenId,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });
    const profileInfos = ticket.getPayload();

    return {
      firstName: profileInfos.name,
      lastName: profileInfos.family_name ?? '',
      email: profileInfos.email,
    };
  }

  async getUserProfileFromAccessToken(token: string): Promise<Profile> {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
    );
    const profileInfos = response.data;

    return {
      firstName: profileInfos.givenName,
      lastName: profileInfos.family_name ?? '',
      email: profileInfos.email,
    };
  }
}
