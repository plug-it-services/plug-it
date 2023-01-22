import {
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
} from '@nestjs/common';
import { PlugsService } from './plugs.service';
import UserHeaderDto from '../dto/UserHeader.dto';
import { PlugSubmitDto } from './dto/PlugSubmit.dto';

@Controller('public/plugs')
export class PublicController {
  constructor(private plugsService: PlugsService) {}

  @Get()
  async listUserPlugs(@Headers('user') userDto: string) {
    const user: UserHeaderDto = JSON.parse(userDto);

    return this.plugsService.findByOwner(user.id);
  }

  @Post()
  async createPlug(
    @Headers('user') userDto: string,
    @Body() plug: PlugSubmitDto,
  ) {
    const user: UserHeaderDto = JSON.parse(userDto);

    await this.plugsService.validateSteps(plug);
    return this.plugsService.create(user.id, plug);
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
    await this.plugsService.validateSteps(plug);
    return this.plugsService.update(id, plug);
  }

  @Put(':id/enabled')
  async editEnabled(
    @Param('id') id: string,
    @Headers('user') userDto: string,
    @Param('enabled') enabled: boolean,
  ) {
    const user: UserHeaderDto = JSON.parse(userDto);
    const current = await this.plugsService.findById(id);

    if (!current)
      throw new NotFoundException(`Plug with id ${id} does not exist`);
    if (current.owner !== user.id)
      throw new ForbiddenException('Cannot edit a plug that is not yours');
    return this.plugsService.editEnabled(id, enabled);
  }
}
