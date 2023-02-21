import { Injectable } from '@nestjs/common';
import { OutlookAuthService } from './outlook-auth.service';
import axios from 'axios';

@Injectable()
export class OutlookService {
  constructor(private outlookAuthService: OutlookAuthService) {}
  /*
  private authClient: auth.OAuth2User;

  private client: Client;

  constructor(private configService: ConfigService) {
    this.authClient = new auth.OAuth2User({
      client_id: this.configService.getOrThrow<string>('CLIENT_ID'),
      client_secret: this.configService.getOrThrow<string>('CLIENT_SECRET'),
      callback: this.configService.getOrThrow<string>('OAUTH2_CALLBACK'),
      scopes: ['tweet.read', 'users.read'],
    });
    this.client = new Client(this.authClient);
  }

  async getAuthUrl(userId: number) {
    return this.authClient.generateAuthURL({
      state: userId.toString(),
      code_challenge_method: 's256',
    });
  }

  async getAccessToken(code: string) {
    try {
      await this.authClient.requestAccessToken(code);
    } catch (e) {
      console.error(e);
    }
  }
*/

  async sendMail(message: any) {
    const token = await this.outlookAuthService.getAccessToken(message.userId);
    const url = 'https://graph.microsoft.com/v1.0/me/sendMail';

    try {
      const object = message.fields.find(
        (field: any) => field.key === 'object',
      ).value;
      const body = message.fields.find(
        (field: any) => field.key === 'body',
      ).value;
      const to = message.fields.find((field: any) => field.key === 'to').value;
      await axios.post(
        url,
        {
          message: {
            subject: object,
            body: {
              contentType: 'Text',
              content: body,
            },
            toRecipients: [
              {
                emailAddress: {
                  address: to,
                },
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
  }
}
