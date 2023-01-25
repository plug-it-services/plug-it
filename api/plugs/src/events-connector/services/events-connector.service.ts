import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { EventInitializeDto } from '../../dto/EventInitialize.dto';
import { ActionTriggerDto } from '../../dto/ActionTrigger.dto';

@Injectable()
export class EventsConnectorService {
  private logger = new Logger(EventsConnectorService.name);
  private queueTemplate: string;
  private readonly queueTemplateNeedle: string;

  constructor(
    private amqpConnection: AmqpConnection,
    private configService: ConfigService,
  ) {
    this.queueTemplate = this.configService.getOrThrow<string>(
      'PLUGS_ACTION_QUEUE_TEMPLATE',
    );
    this.queueTemplateNeedle = this.configService.getOrThrow<string>(
      'PLUGS_ACTION_QUEUE_TEMPLATE_NEEDLE',
    );
  }

  private buildActionQueue(service: string) {
    return this.queueTemplate.replace(this.queueTemplateNeedle, service);
  }

  async emitEventInitialize(service: string, data: EventInitializeDto) {
    const queue = this.buildActionQueue(service);

    this.amqpConnection.publish('amq.direct', queue, data);
  }

  async emitActionTrigger(service: string, data: ActionTriggerDto) {
    const queue = this.buildActionQueue(service);

    this.logger.log(
      `Emitting action trigger to queue ${queue} : ${JSON.stringify(data)}`,
    );

    this.amqpConnection.publish('amq.direct', queue, data);
  }
}
