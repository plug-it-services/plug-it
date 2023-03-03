import { Injectable, Logger } from '@nestjs/common';
import { AmqpService } from './amqp.service';
import { WebHookEntity } from 'src/schemas/webhook.entity';

@Injectable()
export class GithubEventService {
  private logger = new Logger(GithubEventService.name);

  constructor(private readonly amqpService: AmqpService) {}

  async publishEvent(webhook: WebHookEntity, variables: any) {
    await this.amqpService.publish(
      'plugs_events',
      webhook.eventId,
      webhook.plugId,
      webhook.userId,
      variables,
    );
  }

  getBaseEventData(
    body: any,
    headers: any,
  ): {
    action: string;
    url: string;
    sender: string;
    sender_mail: string;
  } {
    let url = '';
    try {
      url = body.repository.html_url;
    } catch {}

    let mail = 'Confidential';
    try {
      mail = body.sender.email || 'Confidential';
    } catch {}

    let login = 'Confidential';
    try {
      login = body.sender.name || body.sender.login || 'Confidential';
    } catch {}


    let repo = 'Unidentified';
    try {
      repo = body.repository.name || 'Unidentified';
    } catch {}

    let action = 'Unidentified'
    try {
      action = headers['X-Github-Event'] || 'Unidentified';
    } catch {}

    const data = {
      action: action,
      url: url,
      sender: login,
      sender_mail: mail,
    };
    this.logger.log(
      `Processing '${data.action}' event on repository '${repo}' ...`,
    );
    return data;
  }

  getCommits(body: any) {
    let commitsStr = '';

    for (let i = 0; i < body.commits.length; ++i) {
      commitsStr += '\n\t -' + body.commits[i].message;
    }
    return commitsStr;
  }

  getRepositoryName(body: any) {
    try {
      return body.repository.name;
    } catch {
      return '';
    }
  }

  getActionType(body: any) {
    try {
      return body.action;
    } catch {
      return '';
    }
  }

  // Organization Events
  async processOrgPushEvent(
    body: { organization: any; commits: any[] },
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const commitsStr = this.getCommits(body);

    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
      { key: 'commits', value: commitsStr },
    ];

    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgStarCreatedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    if (this.getActionType(body) != 'created') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
    ];

    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgStarDeletedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    if (this.getActionType(body) != 'deleted') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
    ];

    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgAllEvent(body: any, webhook: WebHookEntity, headers: any) {
    const data = this.getBaseEventData(body, headers);
    let actionType = '';
    try {
      actionType = ' : ' + body.action;
    } catch (e) {}
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
      { key: 'event', value: data.action + actionType },
    ];

    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgCustomEvent(body: any, webhook: WebHookEntity, headers: any) {
    const data = this.getBaseEventData(body, headers);
    let actionType = '';
    try {
      actionType = ' : ' + body.action;
    } catch (e) {}
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
      { key: 'event', value: data.action + actionType },
    ];

    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgPROpenedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const actionType = this.getActionType(body);
    if (actionType != 'opened' && actionType != 'reopened') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
      { key: 'number', value: body.number },
      { key: 'body', value: body.pull_request.body || '' },
      { key: 'title', value: body.pull_request.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgPRUpdatedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const actionType = this.getActionType(body);
    if (actionType == 'opened' || actionType == 'closed') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
      { key: 'number', value: body.number },
      { key: 'event', value: actionType },
      { key: 'body', value: body.pull_request.body || '' },
      { key: 'title', value: body.pull_request.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgPRClosedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const actionType = this.getActionType(body);
    if (actionType != 'closed') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
      { key: 'number', value: body.number },
      { key: 'body', value: body.pull_request.body || '' },
      { key: 'title', value: body.pull_request.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgIssueEvent(body: any, webhook: WebHookEntity, headers: any) {
    const data = this.getBaseEventData(body, headers);
    const actionType = this.getActionType(body);
    if (actionType != 'opened' && actionType != 'reopened') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
      { key: 'body', value: body.issue.body || '' },
      { key: 'title', value: body.issue.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgIssueUpdateEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const actionType = this.getActionType(body);
    if (
      actionType == 'opened' ||
      actionType == 'closed' ||
      actionType == 'deleted'
    )
      return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
      { key: 'event', value: actionType },
      { key: 'body', value: body.issue.body || '' },
      { key: 'title', value: body.issue.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processOrgIssueClosedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const actionType = this.getActionType(body);
    if (actionType != 'closed') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'repo', value: this.getRepositoryName(body) },
      { key: 'url', value: data.url },
      { key: 'body', value: body.issue.body || '' },
      { key: 'title', value: body.issue.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  // Repository Events
  async processRepoPushEvent(body: any, webhook: WebHookEntity, headers: any) {
    const data = this.getBaseEventData(body, headers);
    const commitsStr = this.getCommits(body);

    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
      { key: 'commits', value: commitsStr },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processRepoStarCreatedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    if (this.getActionType(body) != 'created') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processRepoStarDeletedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    if (this.getActionType(body) != 'deleted') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processRepoPROpenedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const action = this.getActionType(body);
    if (action != 'opened' && action != 'reopened') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
      { key: 'number', value: body.number },
      { key: 'body', value: body.pull_request.body || '' },
      { key: 'title', value: body.pull_request.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processRepoPRUpdatedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const action = this.getActionType(body);
    if (action == 'opened' || action == 'reopened' || action == 'closed')
      return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
      { key: 'number', value: body.number },
      { key: 'body', value: body.pull_request.body || '' },
      { key: 'title', value: body.pull_request.title || '' },
      { key: 'event', value: action },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }
  async processRepoPRClosedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const action = this.getActionType(body);
    if (action != 'closed') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
      { key: 'number', value: body.number },
      { key: 'body', value: body.pull_request.body || '' },
      { key: 'title', value: body.pull_request.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processRepoAllEvent(body: any, webhook: WebHookEntity, headers: any) {
    const data = this.getBaseEventData(body, headers);
    let actionType = '';
    try {
      actionType = ' : ' + body.action;
    } catch (e) {}

    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
      { key: 'event', value: data.action + actionType },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processRepoCustomEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    let actionType = '';
    try {
      actionType = ' : ' + body.action;
    } catch (e) {}

    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
      { key: 'event', value: data.action + actionType },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processRepoIssueEvent(body: any, webhook: WebHookEntity, headers: any) {
    const data = this.getBaseEventData(body, headers);
    const actionType = this.getActionType(body);
    if (actionType != 'opened' && actionType != 'reopened') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
      { key: 'body', value: body.issue.body || '' },
      { key: 'title', value: body.issue.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processRepoIssueUpdateEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const actionType = this.getActionType(body);
    if (
      actionType == 'opened' ||
      actionType == 'closed' ||
      actionType == 'deleted'
    )
      return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
      { key: 'event', value: actionType },
      { key: 'body', value: body.issue.body || '' },
      { key: 'title', value: body.issue.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }

  async processRepoIssueClosedEvent(
    body: any,
    webhook: WebHookEntity,
    headers: any,
  ) {
    const data = this.getBaseEventData(body, headers);
    const actionType = this.getActionType(body);
    if (actionType != 'closed') return;
    const variables = [
      { key: 'sender', value: data.sender },
      { key: 'sender_mail', value: data.sender_mail },
      { key: 'url', value: data.url },
      { key: 'body', value: body.issue.body || '' },
      { key: 'title', value: body.issue.title || '' },
    ];
    await this.publishEvent(webhook, variables);
    this.logger.log('Successfully processed Event!');
  }
}
