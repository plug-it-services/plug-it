import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OutlookMailStateEntity } from "src/schemas/outlookMailStateEntity";
import { OutlookService } from "./outlook.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class MailWatcherService {
  private logger = new Logger(MailWatcherService.name);

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
    const states: OutlookMailStateEntity[] = await this.outlookMailStateRepository.find();
    this.logger.log("Started watching mails for '" + states.length.toString() + "' plugs !");
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

    this.logger.log(
      `Publishing to ${queue} with message ${JSON.stringify(msg)}`,
    );
    await this.amqpConnection.publish('amq.direct', queue, msg);
    this.logger.log(`Published to ${queue}`);
  }

  private async watchState(state: OutlookMailStateEntity) {
    const found = await this.outlookMailStateRepository.findBy({
      plugId: state.plugId,
    });
    this.logger.log("Watching mails for plug :" + state.plugId);
    if (found === undefined || found.length === 0) {
      this.logger.error(
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
    this.logger.log("Reading '" + mails.length.toString() +"' mails ...");
    for (let i = 0; i < mails.length; ++i) {
      this.logger.log("Reading '" + mails[i].subject + "' mail ...");
      if (this.isFilteredMail(mails[i], state)) {
        this.logger.log("Mail '" + mails[i].subject + "' passed validation !!!");
        await this.publish(
          'plugs_events',
          'mailReceived',
          state.plugId,
          state.userId,
          [
            { key:"sender", value: mails[i].sender },
            { key:"subject", value: mails[i].subject },
            { key:"body", value: mails[i].body.content },
            { key:"id", value: mails[i].id },
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
        this.logger.log("Seeking if mail date received: '" + mails[i].subject + "' ");
        if (date.getTime() < latest) {
          this.logger.log("Mail to old: '" + mails[i].subject + "', stopped fetching mail.");
          this.logger.log("Mail date: " + mailInfo.data.receivedDateTime);
          this.logger.log("Mail timestamp: " + date.getTime().toString());
          this.logger.log("Against latest: " + latest.toString());
          return foundMails;
        }
        foundMails.push(mailInfo.data);
        actual += 1;
      }
      count += 10;
    }
  }
}
