import { Controller } from '@nestjs/common';
import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { TwitterService } from '../services/twitter.service';

@Controller('listener')
export class ListenerController {
  constructor(
    private amqpConnection: AmqpConnection,
    private twitterService: TwitterService,
  ) {}

  @RabbitSubscribe({
    queue: 'plug_event_twitter_initialize',
  })
  async listenForEvents() {
    // TODO: Implement
  }

  @RabbitSubscribe({
    queue: 'plug_action_twitter_triggers',
  })
  async triggerAction(msg: any) {
    const { actionId, userId, serviceId, plugId } = msg;
    if (actionId === 'tweet') {
      const text = msg.fields.find((field: any) => field.key === 'body').value;
      await this.twitterService.postTweet(userId, text);
      return;
    }
    return new Nack(false);
  }
}
