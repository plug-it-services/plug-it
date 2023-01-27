import { Controller, Get, Post, Headers, Response, Param, Query } from "@nestjs/common";
import { TwitterService } from '../services/twitter.service';
import UserHeaderDto from '../dto/UserHeader.dto';
import { ConfigService } from '@nestjs/config';
import { TwitterAuthService } from '../services/twitterAuth.service';

@Controller('/public/')
export class AppController {
  private frontendUrl: string;
  constructor(
    private readonly appService: TwitterService,
    private twitterAuthService: TwitterAuthService,
    private configService: ConfigService,
  ) {
    this.frontendUrl = this.configService.getOrThrow<string>(
      'FRONTEND_SERVICES_PAGE_URL',
    );
  }

  @Post('/oauth2')
  async getAuthUrl(@Response() res, @Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    const url = await this.twitterAuthService.getAuthUrl(user.id);

    res.redirect(url);
  }

  @Post('/disconnect')
  async disconnect(@Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    await this.twitterAuthService.disconnect(user.id);
  }

  @Get('/callback')
  async getAccessToken(
    @Response() res,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    await this.twitterAuthService.storeAccessToken(state, code);

    res.redirect(this.frontendUrl);
  }
}
