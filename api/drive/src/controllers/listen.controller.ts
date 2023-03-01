import { Controller, Logger } from '@nestjs/common';
import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { ActionTriggerDto } from '../dto/ActionTrigger.dto';
import { PlugDisabledDto } from '../dto/PlugDisabled.dto';
import { EventInitializeDto } from '../dto/EventInitialize.dto';
import DriveChangesService from '../services/driveChanges.service';
import FileActionsService from '../services/fileActions.service';

@Controller('listener')
export class ListenerController {
  private logger = new Logger(ListenerController.name);

  constructor(
    private amqpConnection: AmqpConnection,
    private driveChangesService: DriveChangesService,
    private fileActionsService: FileActionsService,
  ) {}

  @RabbitSubscribe({
    queue: 'plug_event_drive_initialize',
  })
  async listenForEvents(msg: EventInitializeDto) {
    try {
      switch (msg.eventId) {
        case 'changesOnMyDrive':
          await this.driveChangesService.setupWebhookOnMyDrive(
            msg.userId,
            msg.plugId,
          );
          break;
        case 'changesOnFile':
          await this.driveChangesService.setupWebhookOnFile(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'fileId').value,
          );
          break;
        default:
          this.logger.log(`Unknown event ${msg.eventId}`);
      }
    } catch (e) {
      this.logger.error(e);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    queue: 'plug_event_drive_disabled',
  })
  async listenForDisabledEvents(msg: PlugDisabledDto) {
    try {
      await this.driveChangesService.stopWebhook(
        msg.userId,
        msg.plugId,
        msg.eventId,
      );
    } catch (e) {
      this.logger.error(e);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    queue: 'plug_action_drive_triggers',
  })
  async triggerAction(msg: ActionTriggerDto) {
    try {
      switch (msg.actionId) {
        case 'CREATE_FILE':
          this.logger.log(
            `Received action to create file for user ${msg.userId}`,
          );
          // TODO
          break;
        default:
          this.logger.warn('Unknown action: ', msg.actionId);
      }
    } catch (e) {
      this.logger.error(e);
      return new Nack(false);
    }
  }
}
