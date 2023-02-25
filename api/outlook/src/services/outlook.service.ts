import { Injectable } from '@nestjs/common';
import { OutlookAuthService } from './outlook-auth.service';
import axios from 'axios';

@Injectable()
export class OutlookService {
  constructor(private outlookAuthService: OutlookAuthService) {}

  async sendMail(message: any) {
    const token = await this.outlookAuthService.getAccessToken(message.userId);
    const url = 'https://graph.microsoft.com/v1.0/me/sendMail';

    try {
      const object = message.fields.find(
        (field: any) => field.key === 'subject',
      ).value;
      const body = message.fields.find(
        (field: any) => field.key === 'body',
      ).value;
      const to = message.fields.find((field: any) => field.key === 'to').value;
      await axios.post(
        url,
        {
          message: {
            subject: object,
            body: {
              contentType: 'Text',
              content: body,
            },
            toRecipients: [
              {
                emailAddress: {
                  address: to,
                },
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          },
        },
      );
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
  }

  async replyMail(message: any) : Promise<string> {
    const token = await this.outlookAuthService.getAccessToken(message.userId);

    try {
      const id = message.fields.find(
        (field: any) => field.key === 'reply_id',
      ).value;
      const url = 'https://graph.microsoft.com/v1.0/me/messages/' + id + '/reply';
      const body = message.fields.find(
        (field: any) => field.key === 'body',
      ).value;
      const res = await axios.post(
        url,
        {
          message: {
            body: {
              contentType: 'Text',
              content: body,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          },
        },
      );
      return res.data.id;
    } catch (e) {
      console.error(e);
    }
    return '';
  }

  async setFocusMail(message: any) {

    try {
      const id = message.fields.find(
        (field: any) => field.key === 'id',
      ).value;
      await this.updateMail({
        "inferenceClassification": "focus"
      },id, message.userId)
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
  }

  async setUnFocusMail(message: any) {

    try {
      const id = message.fields.find(
        (field: any) => field.key === 'id',
      ).value;
      await this.updateMail({
        "inferenceClassification": "other"
      },id, message.userId)
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
  }

  async setLowImportanceMail(message: any) {

    try {
      const id = message.fields.find(
        (field: any) => field.key === 'id',
      ).value;
      await this.updateMail({
        "importance": "Low"
      },id, message.userId)
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
  }

  async setNormalImportanceMail(message: any) {

    try {
      const id = message.fields.find(
        (field: any) => field.key === 'id',
      ).value;
      await this.updateMail({
        "importance": "Normal"
      },id, message.userId)
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
  }

  async setHighImportanceMail(message: any) {

    try {
      const id = message.fields.find(
        (field: any) => field.key === 'id',
      ).value;
      await this.updateMail({
        "importance": "High"
      },id, message.userId)
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
  }

  async updateMail(body: any, id: string, userId: any) {
    const token = await this.outlookAuthService.getAccessToken(userId);

    try {
      const url = 'https://graph.microsoft.com/v1.0/me/messages/' + id;
      await axios.patch(
        url,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          },
        },
      );
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
  }

  async moveMail(message: any) {
    const token = await this.outlookAuthService.getAccessToken(message.userId);

    try {
      const id = message.fields.find(
        (field: any) => field.key === 'id',
      ).value;
      const dest = message.fields.find(
        (field: any) => field.key === 'destination',
      ).value;
      const url = 'https://graph.microsoft.com/v1.0/me/messages/' + id + '/move';
      await axios.post(
        url,
        {
          "destinationId": dest
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          },
        },
      );
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
  }

  async getMails(userId: number, count: number, inbox: string) {
    const token = await this.outlookAuthService.getAccessToken(userId);
    const url =
      'https://graph.microsoft.com/v1.0/me/mailFolders/' +
      inbox +
      '/messages?$top=' +
      count;

    try {
      return await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
      });
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
    return null;
  }

  async getMailInfo(userId: number, mailId: string, inbox: string) {
    const token = await this.outlookAuthService.getAccessToken(userId);
    const url =
      'https://graph.microsoft.com/v1.0/me/mailFolders/' +
      inbox +
      '/messages/' +
      mailId;

    try {
      return await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
      });
    } catch (e) {
      console.error(e);
    }
    //console.log(response.data);
    return null;
  }
}
