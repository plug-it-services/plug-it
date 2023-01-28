import { Controller, Get, Post, Headers, Response, Param } from "@nestjs/common";
import { TwitterService } from './twitter.service';
import UserHeaderDto from './dto/UserHeader.dto';
import { ConfigService } from "@nestjs/config";

@Controller('/public/')
export class AppController {
  private frontendUrl: string;
  constructor(
    private readonly appService: TwitterService,
    private configService: ConfigService,
  ) {
    this.frontendUrl = this.configService.getOrThrow<string>(
      'FRONTEND_SERVICES_PAGE_URL',
    );
  }

  @Post('/oauth2')
  async getAuthUrl(@Response() res, @Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    const url = await this.appService.getAuthUrl(user.id);

    res.redirect(url);
  }

  @Get('/callback')
  async getAccessToken(
    @Response() res,
    @Param('code') code: string,
    @Param('state') state: string,
  ) {
    await this.appService.getAccessToken(code);
    res.redirect();
  }
}
