import { Controller } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Controller('listener')
export class ListenerController {
  constructor(private amqpConnection: AmqpConnection) {}

  @RabbitSubscribe({
    queue: 'plug_event_github_initialize',
  })
  async listenForEvents() {
    // TODO: Implement
  }

  @RabbitSubscribe({
    queue: 'plug_event_github_disabled',
  })
  async listenForDisabledEvents() {
    // TODO: Implement
  }

  @RabbitSubscribe({
    queue: 'plug_action_github_triggers',
  })
  async triggerAction(msg: any) {
    // TODO: Implement
  }
}
