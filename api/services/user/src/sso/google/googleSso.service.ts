import { Injectable } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { SsoService, Profile } from '../sso.service';

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
      lastName: profileInfos.family_name,
      email: profileInfos.email,
    };
  }
}
