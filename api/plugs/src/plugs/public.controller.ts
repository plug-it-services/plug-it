import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
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
    const user: UserHeaderDto = JSON.parse(userDto);

    await this.plugsService.validateSteps(plug);
    await this.plugsService.verifyServicesConnected(user.id, plug);
    const created = await this.plugsService.create(user.id, plug);
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
    const plug = await this.plugsService.findById(id);

    if (!plug) throw new NotFoundException(`Plug with id ${id} does not exist`);
    if (plug.owner !== user.id)
      throw new ForbiddenException('Cannot delete a plug that is not yours');
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
    await this.plugsService.update(id, plug);
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
    return { message: 'success' };
  }
}
