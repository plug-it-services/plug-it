import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { EventInitializeDto } from '../../dto/EventInitialize.dto';
import { ActionTriggerDto } from '../../dto/ActionTrigger.dto';
import { PlugDisabledDto } from '../../dto/PlugDisabled.dto';

@Injectable()
export class EventsConnectorService {
  private logger = new Logger(EventsConnectorService.name);
  private readonly actionTriggerQueueTemplate: string;
  private readonly eventInitializeQueueTemplate: string;
  private readonly plugDisabledQueueTemplate: string;
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
    this.plugDisabledQueueTemplate = this.configService.getOrThrow<string>(
      'PLUGS_PLUG_DISABLED_QUEUE_TEMPLATE',
    );
    this.queueTemplateNeedle = this.configService.getOrThrow<string>(
      'PLUGS_ACTION_QUEUE_TEMPLATE_NEEDLE',
    );
  }

  private buildActionQueue(template: string, service: string) {
    return template.replace(this.queueTemplateNeedle, service);
  }

  private async logAndEmit(queue: string, type: string, data: any) {
    this.logger.log(
      `Emitting ${type} message to queue ${queue} : ${JSON.stringify(data)}`,
    );
    await this.amqpConnection.publish('amq.direct', queue, data);
  }

  async emitEventInitialize(service: string, data: EventInitializeDto) {
    const queue = this.buildActionQueue(
      this.eventInitializeQueueTemplate,
      service,
    );

    await this.logAndEmit(queue, 'event initialize', data);
  }

  async emitActionTrigger(service: string, data: ActionTriggerDto) {
    const queue = this.buildActionQueue(
      this.actionTriggerQueueTemplate,
      service,
    );

    await this.logAndEmit(queue, 'action trigger', data);
  }

  async emitPlugDisabling(service: string, data: PlugDisabledDto) {
    const queue = this.buildActionQueue(
      this.plugDisabledQueueTemplate,
      service,
    );

    await this.logAndEmit(queue, 'plug disabling', data);
  }
}
