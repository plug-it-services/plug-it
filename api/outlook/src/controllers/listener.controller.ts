import { Controller, Logger } from "@nestjs/common";
import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { OutlookService } from '../services/outlook.service';
import { OutlookMailStateEntity } from "../schemas/outlookMailStateEntity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { MailWatcherService } from "../services/mail-watcher.service";

@Controller('listener')
export class ListenerController {
  private logger = new Logger(ListenerController.name);

  constructor(
    private amqpConnection: AmqpConnection,
    private outlookService: OutlookService,
    @InjectRepository(OutlookMailStateEntity)
    private outlookMailStateRepository: Repository<OutlookMailStateEntity>,
    private mailWatcherService: MailWatcherService
  ) {}

  @RabbitSubscribe({
    queue: 'plug_event_outlook_disabled',
  })
  async disableEvent(msg: any) {
    try {
      await this.outlookMailStateRepository.delete({plugId: msg.plugId})
      this.logger.log("Deleted a plug")
    } catch (e) {
      this.logger.error(e)
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    queue: 'plug_event_outlook_initialize',
  })
  async listenForEvents(msg: {plugId:string, eventId: string, userId: number, fields:{key:string, value:string}[]}) {
    this.logger.log("Received a new mail watcher plug !");
    let oldState = (await this.outlookMailStateRepository.findBy({ plugId: msg.plugId }));

    if (oldState) {
      this.logger.log("Found an old plug with same id, deleting it ...");
      await this.outlookMailStateRepository.delete({plugId: msg.plugId});
      this.logger.log("Successfully deleted old plug!");
    }

    try {
      const bodyFilter = msg.fields.find(
        (field: any) => field.key === 'body',
      ).value;
      const subjectFilter = msg.fields.find(
        (field: any) => field.key === 'subject',
      ).value;
      const senderFilter = msg.fields.find(
        (field: any) => field.key === 'sender',
      ).value;
      let inboxFilter = msg.fields.find(
        (field: any) => field.key === 'inbox',
      ).value;
      const date = new Date();

      if (inboxFilter === '')
        inboxFilter = 'inbox';

      this.logger.log("Adding mail watcher with params:");
      this.logger.log("Sender filter: " + senderFilter);
      this.logger.log("Subject filter: " + subjectFilter);
      this.logger.log("Body filter: " + bodyFilter);
      this.logger.log("Inbox filter: " + inboxFilter);
      await this.outlookMailStateRepository.insert(
        {
          plugId: msg.plugId,
          userId: msg.userId,
          latestMailReceived: date.getTime(),
          mailBodyFilter: bodyFilter,
          mailSenderFilter: senderFilter,
          mailSubjectFilter: subjectFilter,
          inboxWatched: inboxFilter,
        }
      );
      let state = (await this.outlookMailStateRepository.findBy({ plugId: msg.plugId }))[0];
      this.mailWatcherService.watchState(state);
    } catch (e) {
      this.logger.error(e)
    }

  }

  async publish(
    queue: string,
    stepId: string,
    plugId: string,
    userId: number,
    runId: string,
    variables: { key: string; value: string }[],
  ) {
    const msg = {
      serviceName: "outlook",
      actionId: stepId,
      plugId: plugId,
      userId: userId,
      runId: runId,
      variables,
    };

    this.logger.log(
      `Publishing to ${queue} with message ${JSON.stringify(msg)}`,
    );
    await this.amqpConnection.publish('amq.direct', queue, msg);
    this.logger.log(`Published to ${queue}`);
  }

  @RabbitSubscribe({
    queue: 'plug_action_outlook_triggers',
  })
  async triggerAction(msg: any) {
    const { actionId, plugId, runId, userId } = msg;
    this.logger.log(`Received an '${actionId}' event !`);
    try {
      switch (actionId) {
        case 'email':
          await this.outlookService.sendMail(msg);
          await this.publish(
            'plug_action_finished',
            'email',
            plugId,
            userId,
            runId,
            []
            )
          return;
        case 'reply_email':
          await this.outlookService.replyMail(msg);
          await this.publish(
            'plug_action_finished',
            'reply_email',
            plugId,
            userId,
            runId,
            []
          )
          return;
        case 'set_high':
          await this.outlookService.setHighImportanceMail(msg);
          await this.publish(
            'plug_action_finished',
            'set_high',
            plugId,
            userId,
            runId,
            []
          )
          return;
        case 'move':
          await this.outlookService.moveMail(msg);
          await this.publish(
            'plug_action_finished',
            'move',
            plugId,
            userId,
            runId,
            []
          )
          return;
        case 'set_low':
          await this.outlookService.setLowImportanceMail(msg);
          await this.publish(
            'plug_action_finished',
            'set_low',
            plugId,
            userId,
            runId,
            []
          )
          return;
        case 'set_normal':
          await this.outlookService.setNormalImportanceMail(msg);
          await this.publish(
            'plug_action_finished',
            'set_normal',
            plugId,
            userId,
            runId,
            []
          )
          return;
        case 'set_not_focused':
          await this.outlookService.setUnFocusMail(msg);
          await this.publish(
            'plug_action_finished',
            'set_not_focused',
            plugId,
            userId,
            runId,
            []
          )
          return;
        case 'set_focused':
          await this.outlookService.setFocusMail(msg);
          await this.publish(
            'plug_action_finished',
            'set_focused',
            plugId,
            userId,
            runId,
            []
          )
          return;
      }
    } catch (error) {
      this.logger.error(error);
      return new Nack(false);
    }

    return new Nack(false);
  }
}
