import { Injectable } from '@nestjs/common';
import { TwitterAuthService } from './twitterAuth.service';
import axios from 'axios';

@Injectable()
export class TwitterService {
  constructor(private twitterAuthService: TwitterAuthService) {}
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
  async postTweet(userId: number, tweet: string) {
    const token = await this.twitterAuthService.getAccessToken(userId);
    const url = 'https://api.twitter.com/2/tweets';

    try {
      await axios.post(
        url,
        { text: tweet },
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
