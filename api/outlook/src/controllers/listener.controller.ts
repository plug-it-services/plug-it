import { Controller } from '@nestjs/common';
import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { OutlookService } from '../services/outlook.service';
import { OutlookMailStateEntity } from "../schemas/outlookMailStateEntity";
import { Repository } from "typeorm";

@Controller('listener')
export class ListenerController {
  constructor(
    private amqpConnection: AmqpConnection,
    private outlookService: OutlookService,
    private outlookMailStateRepository: Repository<OutlookMailStateEntity>,
  ) {}

  @RabbitSubscribe({
    queue: 'plug_event_outlook_disabled',
  })
  async disableEvent(msg: any) {
    try {
      await this.outlookMailStateRepository.delete({plugId: msg.plugId})
    } catch (e) {
      console.error(e)
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    queue: 'plug_event_outlook_initialize',
  })
  async listenForEvents(msg: {plugId:string, eventId: string, userId: number, fields:{key:string, value:string}[]}) {
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
      const inboxFilter = msg.fields.find(
        (field: any) => field.key === 'inbox',
      ).value;
      const date = new Date();

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
      )
    } catch (e) {
      console.error(e)
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

    console.log(
      `Publishing to ${queue} with message ${JSON.stringify(msg)}`,
    );
    await this.amqpConnection.publish('amq.direct', queue, msg);
    console.log(`Published to ${queue}`);
  }

  @RabbitSubscribe({
    queue: 'plug_action_outlook_triggers',
  })
  async triggerAction(msg: any) {
    const { actionId, plugId, runId, userId } = msg;
    if (actionId === 'email') {
      await this.outlookService.sendMail(msg);
      return;
    }
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
        break;
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
        break;
      case 'set_high':
        await this.outlookService.setHighImportanceMail(msg);
        this.publish(
          'plug_action_finished',
          'set_high',
          plugId,
          userId,
          runId,
          []
        )
        break;
      case 'set_low':
        await this.outlookService.setLowImportanceMail(msg);
        this.publish(
          'plug_action_finished',
          'set_low',
          plugId,
          userId,
          runId,
          []
        )
        break;
      case 'set_normal':
        await this.outlookService.setNormalImportanceMail(msg);
        this.publish(
          'plug_action_finished',
          'set_normal',
          plugId,
          userId,
          runId,
          []
        )
        break;
      case 'set_not_focused':
        await this.outlookService.setUnFocusMail(msg);
        this.publish(
          'plug_action_finished',
          'set_not_focused',
          plugId,
          userId,
          runId,
          []
        )
        break;
      case 'set_focused':
        await this.outlookService.setFocusMail(msg);
        this.publish(
          'plug_action_finished',
          'set_focused',
          plugId,
          userId,
          runId,
          []
        )
        break;
    }
    return new Nack(false);
  }
}
