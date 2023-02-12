import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AmqpService {
  private logger = new Logger(AmqpService.name);
  constructor(private amqpConnection: AmqpConnection) {}

  async publish(
    queue: string,
    stepId: string,
    plugId: string,
    userId: number,
    variables: { key: string; value: string }[],
  ) {
    const msg = {
      serviceName: 'starton',
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
}
