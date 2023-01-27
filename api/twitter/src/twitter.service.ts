import { Injectable } from '@nestjs/common';
import { Client, auth } from 'twitter-api-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterService {
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
    await this.authClient.requestAccessToken(code);
  }

  async postTweet(tweet: string) {
    await this.client.tweets.createTweet({ text: tweet });
  }
}
