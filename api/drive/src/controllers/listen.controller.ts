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
import { AmqpService } from "../services/amqp.service";
import { Variable } from "../dto/Variable.dto";

@Controller()
export class ListenerController {
  private logger = new Logger(ListenerController.name);

  constructor(
    private amqpConnection: AmqpConnection,
    private driveChangesService: DriveChangesService,
    private fileActionsService: FileActionsService,
    private amqpService: AmqpService,
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
    let response: Variable[] = [];
    try {
      this.logger.warn(msg);
      switch (msg.actionId) {
        case 'createFile':
          this.logger.log(
            `Received action to create file for user ${msg.userId}`,
          );
          response = await this.fileActionsService.createFile(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'name').value,
          );
          break;
        case 'deleteFile':
          this.logger.log(
            `Received action to delete file for user ${msg.userId}`,
          );
          await this.fileActionsService.deleteFile(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'fileId').value,
          );
          break;
        case 'renameFile':
          this.logger.log(
            `Received action to rename file for user ${msg.userId}`,
          );
          response = await this.fileActionsService.renameFile(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'fileId').value,
            msg.fields.find((field) => field.key === 'name').value,
          );
          break;
        case 'moveFile':
          this.logger.log(
            `Received action to move file for user ${msg.userId}`,
          );
          response = await this.fileActionsService.moveFile(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'fileId').value,
            msg.fields.find((field) => field.key === 'destinationId').value,
          );
          break;
        case 'copyFile':
          this.logger.log(
            `Received action to copy file for user ${msg.userId}`,
          );
          response = await this.fileActionsService.copyFile(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'fileId').value,
            msg.fields.find((field) => field.key === 'destinationId').value,
          );
          break;
        case 'shareFile':
          this.logger.log(
            `Received action to share file for user ${msg.userId}`,
          );
          response = await this.fileActionsService.shareFile(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'fileId').value,
            msg.fields.find((field) => field.key === 'email').value,
            msg.fields.find((field) => field.key === 'role').value,
          );
          break;
        case 'unshareFile':
          this.logger.log(
            `Received action to unshare file for user ${msg.userId}`,
          );
          response = await this.fileActionsService.unshareFile(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'fileId').value,
            msg.fields.find((field) => field.key === 'email').value,
          );
          break;
        case 'getFile':
          this.logger.log(`Received action to get file for user ${msg.userId}`);
          response = await this.fileActionsService.getFile(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'fileId').value,
          );
          break;
        case 'createFolder':
          this.logger.log(
            `Received action to create folder for user ${msg.userId}`,
          );
          response = await this.fileActionsService.createFolder(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'name').value,
          );
          break;
        case 'deleteFolder':
          this.logger.log(
            `Received action to delete folder for user ${msg.userId}`,
          );
          await this.fileActionsService.deleteFolder(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'folderId').value,
          );
          break;
        case 'renameFolder':
          this.logger.log(
            `Received action to rename folder for user ${msg.userId}`,
          );
          await this.fileActionsService.renameFolder(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'folderId').value,
            msg.fields.find((field) => field.key === 'name').value,
          );
          break;
        case 'moveFolder':
          this.logger.log(
            `Received action to move folder for user ${msg.userId}`,
          );
          await this.fileActionsService.moveFolder(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'folderId').value,
            msg.fields.find((field) => field.key === 'destinationId').value,
          );
          break;
        case 'copyFolder':
          this.logger.log(
            `Received action to copy folder for user ${msg.userId}`,
          );
          await this.fileActionsService.copyFolder(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'folderId').value,
            msg.fields.find((field) => field.key === 'destinationId').value,
          );
          break;
        case 'shareFolder':
          this.logger.log(
            `Received action to share folder for user ${msg.userId}`,
          );
          await this.fileActionsService.shareFolder(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'folderId').value,
            msg.fields.find((field) => field.key === 'email').value,
            msg.fields.find((field) => field.key === 'role').value,
          );
          break;
        case 'unshareFolder':
          this.logger.log(
            `Received action to unshare folder for user ${msg.userId}`,
          );
          await this.fileActionsService.unshareFolder(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'folderId').value,
            msg.fields.find((field) => field.key === 'permissionId').value,
          );
          break;
        case 'changeFolderPermission':
          this.logger.log(
            `Received action to change folder permission for user ${msg.userId}`,
          );
          await this.fileActionsService.changeFolderPermission(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'folderId').value,
            msg.fields.find((field) => field.key === 'permissionId').value,
            msg.fields.find((field) => field.key === 'role').value,
          );
          break;
        case 'getFolder':
          this.logger.log(
            `Received action to get folder for user ${msg.userId}`,
          );
          await this.fileActionsService.getFolder(
            msg.userId,
            msg.plugId,
            msg.fields.find((field) => field.key === 'folderId').value,
          );
          break
        default:
          this.logger.warn('Unknown action: ', msg.actionId);
      }
      this.logger.log(
        `Action ${msg.actionId} finished, Notifying plugs microservice...`,
      )
      await this.amqpService.publishAction(msg.actionId, msg.plugId, msg.runId, msg.userId, response);
      this.logger.log(
        `Action ${msg.actionId} finished, Plugs microservice notified`,
      )
    } catch (e) {
      this.logger.error(e);
      return new Nack(false);
    }
  }
}
// TODO send message to plug_action_finished queue
