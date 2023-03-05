import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers, Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PlugsService } from './plugs.service';
import UserHeaderDto from '../dto/UserHeader.dto';
import { PlugSubmitDto } from './dto/PlugSubmit.dto';
import { EventsConnectorService } from '../events-connector/services/events-connector.service';

@Controller('public/plugs')
export class PublicController {
  logger = new Logger(PublicController.name);
  constructor(
    private plugsService: PlugsService,
    private eventConnectorService: EventsConnectorService,
  ) {}

  @Get()
  async listUserPlugs(@Headers('user') userDto: string) {
    const user: UserHeaderDto = JSON.parse(userDto);
    const plugs = await this.plugsService.findByOwner(user.id);

    return plugs.map((plug) => {
      return {
        id: plug.id,
        name: plug.name,
        icons: plug.icons,
        enabled: plug.enabled,
      };
    });
  }

  @Post()
  async createPlug(
    @Headers('user') userDto: string,
    @Body() plug: PlugSubmitDto,
  ) {
    if (!plug.event || !plug.actions.length)
      throw new BadRequestException('Plug must have at least one event/action');

    const user: UserHeaderDto = JSON.parse(userDto);

    await this.plugsService.validateSteps(plug);
    await this.plugsService.verifyServicesConnected(user.id, plug);
    const created = await this.plugsService.create(user.id, plug);
    this.logger.log(`Created plug ${created.id}`);
    await this.eventConnectorService.emitEventInitialize(
      created.event.serviceName,
      {
        plugId: created.id,
        eventId: created.event.id,
        userId: user.id,
        fields: created.event.fields,
      },
    );
    return created;
  }

  @Get(':id')
  async getPlug(@Param('id') id: string, @Headers('user') userDto: string) {
    const user: UserHeaderDto = JSON.parse(userDto);
    const plug = await this.plugsService.findById(id);

    if (!plug) throw new NotFoundException(`Plug with id ${id} does not exist`);
    if (plug.owner !== user.id)
      throw new ForbiddenException('Cannot get a plug that is not yours');
    return plug;
  }

  @Delete(':id')
  async deletePlug(@Param('id') id: string, @Headers('user') userDto: string) {
    const user: UserHeaderDto = JSON.parse(userDto);

    this.logger.log(`Deleting plug ${id} of user ${user.id}`);

    const plug = await this.plugsService.findById(id);

    if (!plug) throw new NotFoundException(`Plug with id ${id} does not exist`);
    if (plug.owner !== user.id)
      throw new ForbiddenException('Cannot delete a plug that is not yours');
    await this.eventConnectorService.emitPlugDisabling(
      plug.event.serviceName,
      {
        plugId: plug.id,
        eventId: plug.event.id,
        userId: user.id,
      }
    );
    return this.plugsService.delete(id);
  }

  @Put(':id')
  async editPlug(
    @Param('id') id: string,
    @Headers('user') userDto: string,
    @Body() plug: PlugSubmitDto,
  ) {
    const user: UserHeaderDto = JSON.parse(userDto);
    const current = await this.plugsService.findById(id);

    if (!current)
      throw new NotFoundException(`Plug with id ${id} does not exist`);
    if (current.owner !== user.id)
      throw new ForbiddenException('Cannot edit a plug that is not yours');
    if (!plug.event || !plug.actions.length)
      throw new BadRequestException('Plug must have at least one event/action');
    await this.plugsService.validateSteps(plug);
    await this.plugsService.verifyServicesConnected(user.id, plug);
    const updated = await this.plugsService.update(id, plug);
    await this.eventConnectorService.emitPlugDisabling(
      current.event.serviceName,
      {
        plugId: current.id,
        eventId: current.event.id,
        userId: user.id,
      },
    );
    // wait 5 seconds to make sure the event is disabled
    const delay = new Promise((resolve) => setTimeout(resolve, 5000));
    delay.then(() => {
      this.eventConnectorService.emitEventInitialize(
        updated.event.serviceName,
        {
          plugId: updated.id,
          eventId: updated.event.id,
          userId: user.id,
          fields: updated.event.fields,
        },
      );
    });
    return { message: 'success' };
  }

  @Put(':id/enabled')
  async editEnabled(
    @Param('id') id: string,
    @Headers('user') userDto: string,
    @Query('enabled') enabled: string,
  ) {
    const user: UserHeaderDto = JSON.parse(userDto);
    const current = await this.plugsService.findById(id);
    const enabledBool = enabled === 'true';

    if (!enabled)
      throw new NotFoundException(`Enabled query parameter is required`);
    if (!current)
      throw new NotFoundException(`Plug with id ${id} does not exist`);
    if (current.owner !== user.id)
      throw new ForbiddenException('Cannot edit a plug that is not yours');
    await this.plugsService.editEnabled(id, enabledBool);
    if (enabledBool)
      await this.eventConnectorService.emitEventInitialize(
        current.event.serviceName,
        {
          plugId: current.id,
          eventId: current.event.id,
          userId: user.id,
          fields: current.event.fields,
        },
      );
    else
      await this.eventConnectorService.emitPlugDisabling(
        current.event.serviceName,
        {
          plugId: current.id,
          eventId: current.event.id,
          userId: user.id,
        },
      );
    return { message: 'success' };
  }
}
