import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubWebhookService {
  constructor(private configService: ConfigService) {}

  async createRepoWebhook(
    repo: string,
    owner: string,
    token: string,
    events: string[],
    uuid: string,
  ): Promise<any> {
    const url = `/repos/${owner}/${repo}/hooks`;

    const githubApi = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const data = {
      name: 'web',
      active: true,
      events: events,
      config: {
        url: this.configService.get<string>('OAUTH2_CALLBACK') + '/' + uuid,
        content_type: 'json',
      },
    };
    return await githubApi.post(url, data);
  }

  async deleteRepoWebhook(
    repo: string,
    owner: string,
    token: string,
    uuid: string,
  ): Promise<any> {
    const url = `/repos/${owner}/${repo}/hooks/${uuid}`;

    const githubApi = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    return await githubApi.delete(url);
  }

  async deleteOrgWebhook(
    org: string,
    token: string,
    uuid: string,
  ): Promise<any> {
    const url = `/repos/${org}/hooks/${uuid}`;

    const githubApi = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    return await githubApi.delete(url);
  }

  async createOrgWebhook(
    org: string,
    token: string,
    events: string[],
    uuid: string,
  ): Promise<any> {
    const url = `/orgs/${org}/hooks`;

    const githubApi = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = {
      name: 'web',
      active: true,
      events: events,
      config: {
        url: this.configService.get<string>('OAUTH2_CALLBACK') + '/' + uuid,
        content_type: 'json',
      },
    };

    return await githubApi.post(url, data);
  }
}
