import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { EventInitializeDto } from '../../dto/EventInitialize.dto';
import { ActionTriggerDto } from '../../dto/ActionTrigger.dto';

@Injectable()
export class EventsConnectorService {
  private logger = new Logger(EventsConnectorService.name);
  private actionTriggerQueueTemplate: string;
  private eventInitializeQueueTemplate: string;
  private readonly queueTemplateNeedle: string;

  constructor(
    private amqpConnection: AmqpConnection,
    private configService: ConfigService,
  ) {
    this.actionTriggerQueueTemplate = this.configService.getOrThrow<string>(
      'PLUGS_ACTION_QUEUE_TEMPLATE',
    );
    this.eventInitializeQueueTemplate = this.configService.getOrThrow<string>(
      'PLUGS_EVENT_INITIALIZE_QUEUE_TEMPLATE',
    );
    this.queueTemplateNeedle = this.configService.getOrThrow<string>(
      'PLUGS_ACTION_QUEUE_TEMPLATE_NEEDLE',
    );
  }

  private buildActionQueue(template: string, service: string) {
    return template.replace(this.queueTemplateNeedle, service);
  }

  async emitEventInitialize(service: string, data: EventInitializeDto) {
    const queue = this.buildActionQueue(
      this.eventInitializeQueueTemplate,
      service,
    );

    this.logger.log(
      `Emitting event initialize to queue ${queue} : ${JSON.stringify(data)}`,
    );

    await this.amqpConnection.publish('amq.direct', queue, data);
  }

  async emitActionTrigger(service: string, data: ActionTriggerDto) {
    const queue = this.buildActionQueue(
      this.actionTriggerQueueTemplate,
      service,
    );

    this.logger.log(
      `Emitting action trigger to queue ${queue} : ${JSON.stringify(data)}`,
    );

    this.amqpConnection.publish('amq.direct', queue, data);
  }
}
