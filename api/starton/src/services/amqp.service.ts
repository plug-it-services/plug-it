import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AmqpService {
  constructor(private amqpConnection: AmqpConnection) {}

  async publish(
    queue: string,
    stepId: string,
    userId: number,
    variables: { key: string; value: string }[],
  ) {
    const msg = {
      serviceName: 'starton',
      eventId: stepId,
      userId,
      variables,
    };
    await this.amqpConnection.publish('amq.direct', queue, msg);
  }
}
