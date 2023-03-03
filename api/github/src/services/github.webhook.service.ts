import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubWebhookService {
  async createRepoWebhook(
    repo: string,
    owner: string,
    token: string,
    events: string[],
    uuid: string,
  ): Promise<void> {
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
        // TODO: check url
        url: 'https://api-area-dev.alexandrejublot.com/webhook/github/' + uuid,
        content_type: 'json',
      },
    };
    return await githubApi.post(url, data);
  }

  async createOrgWebhook(
    org: string,
    token: string,
    events: string[],
    uuid: string,
  ): Promise<void> {
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
        // TODO: check url
        url: 'https://api-area-dev.alexandrejublot.com/webhook/github/' + uuid,
        content_type: 'json',
      },
    };

    return await githubApi.post(url, data);
  }
}
