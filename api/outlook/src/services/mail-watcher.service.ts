import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OutlookMailStateEntity } from "src/schemas/outlookMailStateEntity";
import { OutlookService } from "./outlook.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
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
    const mails = await this.getLatestMails(
      state.latestMailReceived,
      state.userId,
      state.inboxWatched,
    );
    for (let i = 0; i < mails.length; ++i) {
      if (this.isFilteredMail(mails[i], state)) {
        await this.publish(
          'plugs_events',
          'mailReceived',
          state.plugId,
          state.userId,
          [
            { key:"sender", value: mails[i].sender },
            { key:"subject", value: mails[i].subject },
            { key:"body", value: mails[i].body.content },
            { key:"id", value: mails[i].body.content },
          ],
        );
      }
    }
    if (mails.length != 0) {
      await this.updateState(state.plugId, mails[0].receivedDateTime);
      state.latestMailReceived = mails[0].receivedDateTime;
    }
    setTimeout(() => {
      this.watchState(state);
    }, 1000*120);
  }

  private isFilteredMail(mail: any, state: OutlookMailStateEntity) {
    return (
      mail.subject.includes(state.mailSubjectFilter) &&
      mail.sender.includes(state.mailSenderFilter) &&
      mail.body.content.includes(state.mailBodyFilter)
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

      const mails : any[] = latestMails.data.values;
      for (let i = 0; i < mails.length; ++i) {
        if (actual <= actualIdxWatched) continue;
        const mailInfo = await this.outlookService.getMailInfo(
          userId,
          mails[i].id,
          inbox,
        );
        const date = new Date(mailInfo.data.receivedDateTime);
        if (date.getTime() < latest) {
          return foundMails;
        }
        foundMails.push(mailInfo.data);
        actual += 1;
      }
      count += 10;
    }
  }
}
