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
import { GithubAuthService } from '../services/githubAuth.service';
import axios from 'axios';
import Oauth2StartDto from '../dto/Oauth2Start.dto';
import { WebHookService } from 'src/services/webhook.service';
import { GithubEventService } from '../services/github.events.service';

@Controller('public')
export class PublicController {
  private frontendUrl: string;
  private logger = new Logger(PublicController.name);
  constructor(
    private githubAuthService: GithubAuthService,
    private gitEventService: GithubEventService,
    private configService: ConfigService,
    private webhookService: WebHookService,
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
    const url = await this.githubAuthService.getAuthUrl(
      user.id,
      body.redirectUrl,
    );

    return { url };
  }

  @Post('disconnect')
  async disconnect(@Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    await this.githubAuthService.disconnect(user.id);

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
    @Query('error') error: string,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    if (error) {
      this.logger.error('Error from github : ' + error);
      res.status(200).send();
      return;
    }

    const { userId, redirectUrl } =
      await this.githubAuthService.storeAccessToken(state, code);

    await axios.post(
      this.configService.getOrThrow<string>('PLUGS_SERVICE_LOGGED_IN_URL'),
      {
        userId: userId,
      },
    );

    res.redirect(redirectUrl);
  }

  @Post(':uuid')
  async onTrigger(
    @Headers() headers: any,
    @Body() body: any,
    @Param('uuid') uuid: string,
  ) {
    this.logger.log(`Received a github event for webhook ${uuid}`);
    const webhook = await this.webhookService.findByUuiD(uuid);
    this.logger.log(`GitHub event: '${webhook.eventId}'`);
    this.logger.log(`GitHub event body:\n ${body}`);
    try {

      switch (webhook.eventId) {
        case 'orgPush':
          await this.gitEventService.processOrgPushEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'orgStarCreated':
          await this.gitEventService.processOrgStarCreatedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'orgStarDeleted':
          await this.gitEventService.processOrgStarDeletedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'orgPROpened':
          await this.gitEventService.processOrgPROpenedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'orgPRClosed':
          await this.gitEventService.processOrgPRClosedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'orgPRUpdated':
          await this.gitEventService.processOrgPRUpdatedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'orgIssueOpened':
          await this.gitEventService.processOrgIssueEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'orgIssueClosed':
          await this.gitEventService.processOrgIssueClosedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'orgIssueUpdated':
          await this.gitEventService.processOrgIssueUpdateEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'orgAll':
          await this.gitEventService.processOrgAllEvent(body, webhook, headers);
          break;
        case 'orgCustom':
          await this.gitEventService.processOrgCustomEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoPush':
          await this.gitEventService.processRepoPushEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoStarCreated':
          await this.gitEventService.processRepoStarCreatedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoStarDeleted':
          await this.gitEventService.processRepoStarDeletedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoPROpened':
          await this.gitEventService.processRepoPROpenedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoPRClosed':
          await this.gitEventService.processRepoPRClosedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoPRUpdated':
          await this.gitEventService.processRepoPRUpdatedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoIssueOpened':
          await this.gitEventService.processRepoIssueEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoIssueClosed':
          await this.gitEventService.processRepoIssueClosedEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoIssueUpdated':
          await this.gitEventService.processRepoIssueUpdateEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoAll':
          await this.gitEventService.processRepoAllEvent(
            body,
            webhook,
            headers,
          );
          break;
        case 'repoCustom':
          await this.gitEventService.processRepoCustomEvent(
            body,
            webhook,
            headers,
          );
          break;
      }
    } catch (error) {
      this.logger.error(
        'Error occured when processing event: ' + webhook.eventId,
      );
      this.logger.error(error);
    }
    return { message: 'success' };
  }
}
