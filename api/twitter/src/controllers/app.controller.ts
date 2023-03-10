import {
  Controller,
  Get,
  Post,
  Headers,
  Response,
  Query,
  Logger,
  InternalServerErrorException,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { TwitterService } from '../services/twitter.service';
import UserHeaderDto from '../dto/UserHeader.dto';
import { ConfigService } from '@nestjs/config';
import { TwitterAuthService } from '../services/twitterAuth.service';
import axios from 'axios';
import Oauth2StartDto from '../dto/Oauth2Start.dto';

@Controller('public')
export class AppController {
  private frontendUrl: string;
  private logger = new Logger(AppController.name);
  constructor(
    private readonly appService: TwitterService,
    private twitterAuthService: TwitterAuthService,
    private configService: ConfigService,
  ) {
    this.frontendUrl = this.configService.getOrThrow<string>(
      'FRONTEND_SERVICES_PAGE_URL',
    );
  }

  @Post('oauth2')
  async getAuthUrl(
    @Headers('user') userHeader: string,
    @Body(new ValidationPipe()) body: Oauth2StartDto,
  ) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    const url = await this.twitterAuthService.getAuthUrl(
      user.id,
      body.redirectUrl,
    );

    return { url };
  }

  @Post('disconnect')
  async disconnect(@Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    await this.twitterAuthService.disconnect(user.id);

    try {
      await axios.post(
        this.configService.getOrThrow<string>('PLUGS_SERVICE_LOGGED_OUT_URL'),
        {
          userId: user.id,
        },
      );
    } catch (e) {
      this.logger.error(
        'Cannot contact plugs microservice : JSON.stringify(e)',
      );
      throw new InternalServerErrorException('Cannot save disconnected state');
    }
  }

  @Get('callback')
  async getAccessToken(
    @Response() res,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    const { userId, redirectUrl } =
      await this.twitterAuthService.storeAccessToken(state, code);

    await axios.post(
      this.configService.getOrThrow<string>('PLUGS_SERVICE_LOGGED_IN_URL'),
      {
        userId: userId,
      },
    );

    res.redirect(redirectUrl);
  }
}
