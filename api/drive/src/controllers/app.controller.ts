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
  Param,
} from '@nestjs/common';
import UserHeaderDto from '../dto/UserHeader.dto';
import { ConfigService } from '@nestjs/config';
import { DriveAuthService } from '../services/driveAuth.service';
import axios from 'axios';
import Oauth2StartDto from '../dto/Oauth2Start.dto';
import { WebHookService } from '../services/webhook.service';
import { AmqpService } from '../services/amqp.service';

@Controller('public')
export class AppController {
  private frontendUrl: string;
  private logger = new Logger(AppController.name);
  constructor(
    private githubAuthService: DriveAuthService,
    private configService: ConfigService,
    private webhookService: WebHookService,
    private amqpService: AmqpService,
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

    this.logger.log(`User ${user.id} is initiated a connection to drive`);
    const url = await this.githubAuthService.getAuthUrl(
      user.id,
      body.redirectUrl,
    );

    this.logger.log(`User ${user.id} will be redirected to ${url}`);
    return { url };
  }

  @Post('disconnect')
  async disconnect(@Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);

    this.logger.log(`User ${user.id} is initiated a disconnection from drive`);

    await this.githubAuthService.disconnect(user.id);

    this.logger.log(
      `User ${user.id} is disconnected from drive. Notifying plugs microservice`,
    );
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
    this.logger.log(
      `User ${user.id} is fully disconnected from drive (notified plugs microservice).`,
    );
  }

  @Get('callback')
  async getAccessToken(
    @Response() res,
    @Query('error') error: string,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    if (error) {
      this.logger.error('Error from github : ' + error);
      res.status(200).send();
      return;
    }

    this.logger.log(
      `Received callback from github with code ${code} and state ${state}`,
    );

    const { userId, redirectUrl } =
      await this.githubAuthService.storeAccessToken(state, code);

    this.logger.log(
      `User ${userId} is connected to drive. Notifying plugs microservice`,
    );

    await axios.post(
      this.configService.getOrThrow<string>('PLUGS_SERVICE_LOGGED_IN_URL'),
      {
        userId: userId,
      },
    );

    this.logger.log(
      `User ${userId} is fully connected to drive (notified plugs microservice). Redirecting user to ${redirectUrl}`,
    );

    res.redirect(redirectUrl);
  }

  @Post(':uuid')
  async triggerWebhook(
    @Param('uuid') webhookId: string,
    @Headers('X-Goog-Resource-ID') resourceId: string,
    @Headers('X-Goog-Resource-State') resourceState: string,
  ) {
    if (resourceState === 'sync') {
      this.logger.log(`Ignoring sync event`);
      return;
    }
    const webhook = await this.webhookService.getWebhookById(webhookId);

    if (!webhook) {
      this.logger.error(`Webhook ${webhookId} not found`);
      return;
    }

    this.logger.log(`Webhook ${webhookId} triggered`);
    await this.amqpService.publishEvent(
      webhook.eventId,
      webhook.plugId,
      webhook.userId,
      [],
    );
    this.logger.log(`Webhook ${webhookId} event published`);
  }
}
