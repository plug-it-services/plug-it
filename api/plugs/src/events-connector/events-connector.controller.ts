import { Controller, Logger } from '@nestjs/common';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EventFiredDto } from '../dto/EventFired.dto';
import { EventsConnectorService } from './services/events-connector.service';
import { RunsService } from './services/runs.service';
import { PlugsService } from '../plugs/plugs.service';
import { ServicesService } from '../services/services/services.service';
//import { Plug } from '../plugs/schemas/plug.schema';
//import { Service } from '../services/schemas/service.schema';
//import { Run } from './schemas/run.schema';
import { VariablesService } from './services/variables.service';
import { ActionFinishedDto } from '../dto/ActionFinished.dto';

@Controller('events-connector')
export class EventsConnectorController {
  private logger = new Logger(EventsConnectorController.name);

  constructor(
    private eventsConnectorService: EventsConnectorService,
    private runsService: RunsService,
    private plugsService: PlugsService,

    private variablesService: VariablesService,
  ) {}

  private async findPlugByEvent(event: EventFiredDto) {
    const plug = await this.plugsService.findOwnedByEvent(
      event.userId,
      event.serviceName,
      event.eventId,
    );
    if (!plug) {
      this.logger.log(
        'No plug found for the event ' +
          event.eventId +
          ' from service ' +
          event.serviceName,
      );
      throw new Nack();
    }
    return plug;
  }
  /*
  private async findEventService(plug: Plug) {
    const service = await this.servicesService.findByName(
      plug.event.serviceName,
    );

    if (!service) {
      this.logger.log(
        'No service found for the event ' +
          plug.event.id +
          ' from service ' +
          plug.event.serviceName,
      );
      throw new Nack();
    }
    return service;
  }

  private findEvent(eventId: string, service: Service) {
    const serviceEvent = service.events.find((event) => event.id === eventId);

    if (!serviceEvent) {
      this.logger.log(
        'No event found for the event ' +
          eventId +
          ' from service ' +
          service.name,
      );
      throw new Nack();
    }
    return serviceEvent;
  }
  */

  @RabbitSubscribe({
    queue: 'plugs_events',
  })
  async handleEvent(event: EventFiredDto) {
    this.logger.log(
      'Treating event id ' +
        event.eventId +
        ' from services ' +
        event.serviceName,
    );

    try {
      const plug = await this.findPlugByEvent(event);
      //const service = await this.findEventService(plug);
      /*const serviceEvent = this.findEvent(event.eventId, service);
      event.variables = this.variablesService.addDataTypes(
        event.variables,
        serviceEvent.variables,
        event.eventId,
        event.serviceName,
      );*/
      const run = await this.runsService.create(plug.id, event.variables);
      const fields = this.variablesService.fillFields(
        plug.actions[0].fields,
        run.variables,
      );
      await this.eventsConnectorService.emitActionTrigger(
        plug.actions[0].serviceName,
        {
          actionId: plug.actions[0].id,
          userId: event.userId,
          runId: run.id,
          fields,
        },
      );
    } catch (e) {
      return new Nack();
    }
  }

  @RabbitSubscribe({
    queue: 'plug_action_finished',
  })
  async handleActionFinished(event: ActionFinishedDto) {
    const { plug, id, ...run } = await this.runsService.findById(event.runId);

    if (!plug) {
      this.logger.warn('No plug found for the run ' + event.runId);
      throw new Nack(false);
    }
    if (run.stepIdx + 1 >= plug.actions.length) {
      this.logger.log('Run ' + id + ' execution finished');
      await this.runsService.delete(id);
      return;
    }
    run.variables.push(event.variables);
    run.stepIdx++;
    await this.runsService.update(id, run);

    const fields = this.variablesService.fillFields(
      plug.actions[run.stepIdx].fields,
      run.variables,
    );
    await this.eventsConnectorService.emitActionTrigger(
      plug.actions[0].serviceName,
      {
        actionId: plug.actions[run.stepIdx].id,
        userId: event.userId,
        runId: id,
        fields,
      },
    );
  }
}
