import { Controller, Logger } from '@nestjs/common';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { WebHookService } from '../services/webhook.service';
import { GithubWatcherService } from '../services/github.watcher.service';
import { GithubAuthService } from "../services/githubAuth.service";
import { GithubWebhookService } from "../services/github.webhook.service";

@Controller('listener')
export class ListenerController {
  private logger = new Logger(ListenerController.name);

  constructor(
    private webHookService: WebHookService,
    private gitWatcherService: GithubWatcherService,
    private gitWebhookService: GithubWebhookService,
    private gitAuthService: GithubAuthService,
  ) {}

  @RabbitSubscribe({
    queue: 'plug_event_github_disabled',
  })
  async disableEvent(msg: { plugId: string }) {
    try {
      const hook = await this.webHookService.find(msg.plugId);
      const token = await this.gitAuthService.getAccessToken(hook.userId);
      if (hook.eventId .startsWith("repo")) {
        await this.webHookService.deleteById(msg.plugId);
        await this.gitWebhookService.deleteRepoWebhook(hook.repo, hook.owner, token, hook.webhookId);
      } else {
        await this.webHookService.deleteById(msg.plugId);
        await this.gitWebhookService.deleteOrgWebhook(hook.org, token, hook.webhookId);
      }
      this.logger.log('Deleted a plug');
    } catch (e) {
      this.logger.error(e);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    queue: 'plug_event_github_initialize',
  })
  async listenForEvents(msg: {
    plugId: string;
    eventId: string;
    userId: number;
    fields: { key: string; value: string }[];
  }) {
    this.logger.log('Received a new mail watcher plug !');
    const oldState = await this.webHookService.find(msg.plugId);

    if (oldState) {
      this.logger.log('Found an old plug with same id, deleting it ...');
      await this.webHookService.deleteById(msg.plugId);
      this.logger.log('Successfully deleted old plug!');
    }
    try {
      switch (msg.eventId) {
        case 'orgPush':
          await this.gitWatcherService.createOrgPushWatcher(msg);
          break;
        case 'orgAll':
          await this.gitWatcherService.createOrgAllWatcher(msg);
          break;
        case 'orgCustom':
          await this.gitWatcherService.createOrgCustomWatcher(msg);
          break;
        case 'orgStarCreated':
        case 'orgStarDeleted':
          await this.gitWatcherService.createOrgStarWatcher(msg);
          break;
        case 'orgPROpened':
        case 'orgPRClosed':
        case 'orgPRUpdated':
          await this.gitWatcherService.createOrgPRWatcher(msg);
          break;
        case 'orgIssueOpened':
        case 'orgIssueClosed':
        case 'orgIssueUpdated':
          await this.gitWatcherService.createOrgIssueWatcher(msg);
          break;
        case 'repoAll':
          await this.gitWatcherService.createRepoAllWatcher(msg);
          break;
        case 'repoCustom':
          await this.gitWatcherService.createRepoCustomWatcher(msg);
          break;
        case 'repoPush':
          await this.gitWatcherService.createRepoPushWatcher(msg);
          break;
        case 'repoStarCreated':
        case 'repoStarDeleted':
          await this.gitWatcherService.createRepoStarWatcher(msg);
          break;
        case 'repoPROpened':
        case 'repoPRClosed':
        case 'repoPRUpdated':
          await this.gitWatcherService.createRepoPRWatcher(msg);
          break;
        case 'repoIssueOpened':
        case 'repoIssueClosed':
        case 'repoIssueUpdated':
          await this.gitWatcherService.createRepoIssueWatcher(msg);
          break;
      }
    } catch (e) {
      this.logger.error(e);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    queue: 'plug_action_github_triggers',
  })
  async triggerAction(msg: any) {
    // TODO: Implement
  }
}
