import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OutlookMailStateEntity } from 'src/schemas/outlookMailStateEntity';
import { OutlookService } from './outlook.service';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class MailWatcherService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(OutlookMailStateEntity)
    private outlookMailStateRepository: Repository<OutlookMailStateEntity>,
    private outlookService: OutlookService,
    private amqpConnection: AmqpConnection,
  ) {
    this.initService();
  }

  private async initService() {
    console.error('failed');
    const states: OutlookMailStateEntity[] = await this.outlookMailStateRepository.find();
    states.forEach(this.watchState);
  }

  private async updateState(plugId: string, latestMailDate: number) {
    await this.outlookMailStateRepository.update(
      { plugId },
      { latestMailReceived: latestMailDate },
    );
  }

  async publish(
    queue: string,
    stepId: string,
    plugId: string,
    userId: number,
    variables: { key: string; value: string }[],
  ) {
    const msg = {
      serviceName: 'outlook',
      eventId: stepId,
      plugId,
      userId,
      variables,
    };

    console.log(
      `Publishing to ${queue} with message ${JSON.stringify(msg)}`,
    );
    await this.amqpConnection.publish('amq.direct', queue, msg);
    console.log(`Published to ${queue}`);
  }

  private async watchState(state: OutlookMailStateEntity) {
    const found = await this.outlookMailStateRepository.findBy({
      plugId: state.plugId,
    });

    if (found === undefined || found.length === 0) {
      console.error(
        "Stopped fetching mails for plug '%s', from user '%s'",
        state.plugId,
        state.userId,
      );
      return;
    }
    const latestMails = await this.getLatestMails(
      state.latestMailReceived,
      state.userId,
      state.inboxWatched,
    );
    for (const mail in latestMails) {
      if (this.isFilteredMail(mail, state)) {
        await this.publish(
          'plugs_events',
          'mailReceived',
          state.plugId,
          state.userId,
          [
            { key:"sender", value: mail['sender'] },
            { key:"subject", value: mail['subject'] },
            { key:"body", value: mail['body']['content'] },
          ],
        );
      }
    }
    if (latestMails.length != 0) {
      await this.updateState(state.plugId, latestMails[0]['receivedDateTime']);
      state.latestMailReceived = latestMails[0]['receivedDateTime'];
    }
    setTimeout(() => {
      this.watchState(state);
    }, 1000*120);
  }

  private isFilteredMail(mail: any, state: OutlookMailStateEntity) {
    return (
      mail['subject'].includes(state.mailSubjectFilter) &&
      mail['sender'].includes(state.mailSenderFilter) &&
      mail['body']['content'].includes(state.mailBodyFilter)
    );
  }

  private async getLatestMails(latest: number, userId: number, inbox: string) {
    let foundMails = [];
    let count: number = 10;
    let actualIdxWatched: number = 0;
    let finished: boolean = false;

    while (!finished) {
      const latestMails = await this.outlookService.getMails(
        userId,
        count,
        inbox,
      );
      let actual = 0;
      for (const mail in latestMails.data.value) {
        if (actual <= actualIdxWatched) continue;
        const mailInfo = await this.outlookService.getMailInfo(
          userId,
          mail['id'],
          inbox,
        );
        if (mailInfo.data['receivedDateTime'] < latest) {
          return foundMails;
        }
        foundMails.push(mailInfo.data);
        actual += 1;
      }
      count += 10;
    }
  }
}
