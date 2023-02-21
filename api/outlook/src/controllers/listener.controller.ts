import { Controller } from '@nestjs/common';
import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { OutlookService } from '../services/outlook.service';

@Controller('listener')
export class ListenerController {
  constructor(
    private amqpConnection: AmqpConnection,
    private outlookService: OutlookService,
  ) {}

  @RabbitSubscribe({
    queue: 'plug_event_outlook_initialize',
  })
  async listenForEvents() {
    // TODO: Implement
  }

  @RabbitSubscribe({
    queue: 'plug_action_outlook_triggers',
  })
  async triggerAction(msg: any) {
    const { actionId } = msg;
    if (actionId === 'email') {
      await this.outlookService.sendMail(msg);
      return;
    }
    return new Nack(false);
  }
}
