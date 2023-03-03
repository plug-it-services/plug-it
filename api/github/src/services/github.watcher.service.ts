import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { WebHookService } from './webhook.service';
import { GithubWebhookService } from './github.webhook.service';
import { GithubAuthService } from './githubAuth.service';

@Injectable()
export class GithubWatcherService {
  private logger = new Logger(GithubWatcherService.name);

  constructor(
    private readonly webhookService: WebHookService,
    private readonly gitHooksService: GithubWebhookService,
    private readonly gitAuthService: GithubAuthService,
  ) {}

  async createOrgPushWatcher(msg: any) {
    this.logger.log('Creating Push event watcher on repository');

    await this.createOrgWatcher(msg, ['push']);

    this.logger.log('Successfully created watcher!');
  }

  async createOrgStarWatcher(msg: any) {
    this.logger.log('Creating Star event watcher on repository');

    await this.createOrgWatcher(msg, ['star']);

    this.logger.log('Successfully created watcher!');
  }

  async createOrgPRWatcher(msg: any) {
    this.logger.log('Creating Pull Request event watcher on repository');

    await this.createOrgWatcher(msg, ['pull_request']);

    this.logger.log('Successfully created watcher!');
  }

  async createOrgIssueWatcher(msg: any) {
    this.logger.log('Creating Issue event watcher on repository');

    await this.createOrgWatcher(msg, ['issue']);

    this.logger.log('Successfully created watcher!');
  }

  async createOrgAllWatcher(msg: any) {
    this.logger.log('Creating All event watcher on repository');

    await this.createOrgWatcher(msg, ['*']);

    this.logger.log('Successfully created watcher!');
  }

  async createOrgCustomWatcher(msg: any) {
    this.logger.log('Creating Custom event watcher on repository');

    const events = msg.fields
      .find((field: any) => field.key === 'events')
      .value.split(',');

    await this.createOrgWatcher(msg, events);

    this.logger.log('Successfully created watcher!');
  }

  async createRepoPushWatcher(msg: any) {
    this.logger.log('Creating Push event watcher on repository');

    await this.createRepoWatcher(msg, ['push']);

    this.logger.log('Successfully created watcher!');
  }

  async createRepoStarWatcher(msg: any) {
    this.logger.log('Creating Star event watcher on repository');

    await this.createRepoWatcher(msg, ['star']);

    this.logger.log('Successfully created watcher!');
  }

  async createRepoPRWatcher(msg: any) {
    this.logger.log('Creating Pull Request event watcher on repository');

    await this.createRepoWatcher(msg, ['pull_request']);

    this.logger.log('Successfully created watcher!');
  }

  async createRepoIssueWatcher(msg: any) {
    this.logger.log('Creating Issue event watcher on repository');

    await this.createOrgWatcher(msg, ['issue']);

    this.logger.log('Successfully created watcher!');
  }

  async createRepoAllWatcher(msg: any) {
    this.logger.log('Creating All event watcher on repository');

    await this.createRepoWatcher(msg, ['*']);

    this.logger.log('Successfully created watcher!');
  }

  async createRepoCustomWatcher(msg: any) {
    this.logger.log('Creating Custom event watcher on repository');

    const events = msg.fields
      .find((field: any) => field.key === 'events')
      .value.split(',');

    await this.createRepoWatcher(msg, events);

    this.logger.log('Successfully created watcher!');
  }

  async createRepoWatcher(
    msg: {
      plugId: string;
      eventId: string;
      userId: number;
      fields: { key: string; value: string }[];
    },
    events: string[],
  ) {
    this.logger.log('Creating repository watcher with event filters: ');
    this.logger.log(events);
    const token = await this.gitAuthService.getAccessToken(msg.userId);
    const uuid = uuidv4();
    const repo = msg.fields.find((field: any) => field.key === 'repo').value;
    const owner = msg.fields.find((field: any) => field.key === 'owner').value;

    this.logger.log('Posting webhook to db ...');
    await this.webhookService.create(uuid, msg.userId, msg.plugId, msg.eventId);

    this.logger.log('Posting webhook to github ...');
    await this.gitHooksService.createRepoWebhook(
      repo,
      owner,
      token,
      events,
      uuid,
    );
  }

  async createOrgWatcher(
    msg: {
      plugId: string;
      eventId: string;
      userId: number;
      fields: { key: string; value: string }[];
    },
    events: string[],
  ) {
    this.logger.log('Creating organization watcher with event filters: ');
    this.logger.log(events);
    const token = await this.gitAuthService.getAccessToken(msg.userId);
    const uuid = uuidv4();
    const org = msg.fields.find((field: any) => field.key === 'org').value;

    this.logger.log('Posting webhook to db ...');
    await this.webhookService.create(uuid, msg.userId, msg.plugId, msg.eventId);
    this.logger.log('Posting webhook to github ...');
    await this.gitHooksService.createOrgWebhook(org, token, events, uuid);
  }
}
