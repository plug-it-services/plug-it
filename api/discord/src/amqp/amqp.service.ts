import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AmqpService {
  private logger = new Logger(AmqpService.name);
  constructor(private amqpConnection: AmqpConnection) {}

  async publishAction(
    actionId: string,
    plugId: string,
    runId: string,
    userId: number,
    variables: { key: string; value: string }[],
  ) {
    const queue = 'plug_action_finished';
    const msg = {
      serviceName: 'discord',
      plugId,
      runId,
      actionId,
      userId,
      variables,
    };

    this.logger.log(
      `Publishing to ${queue} with message ${JSON.stringify(msg)}`,
    );
    await this.amqpConnection.publish('amq.direct', queue, msg);
    this.logger.log(`Published to ${queue}`);
  }

  async publishEvent(
    queue: string,
    stepId: string,
    plugId: string,
    userId: number,
    variables: { key: string; value: string }[],
  ) {
    const msg = {
      serviceName: 'discord',
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
