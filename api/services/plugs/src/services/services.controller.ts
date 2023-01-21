import {
  Body,
  Controller,
  Param,
  Post,
  Headers,
  Get,
  Logger,
} from '@nestjs/common';
import { InitializeRequestDto } from './dto/InitializeRequest.dto';
import { ServicesService } from './services/services.service';
import UserIdDto from './dto/userId.dto';
import UsersConnectionsService from './services/usersConnections.service';
import UserHeaderDto from '../dto/UserHeader.dto';

@Controller()
export class ServicesController {
  private readonly logger = new Logger(ServicesController.name);
  constructor(
    private servicesService: ServicesService,
    private usersConnectionsService: UsersConnectionsService,
  ) {}

  @Post('/service/initialize')
  async initializeService(
    @Param('serviceName') serviceName: string,
    @Body() initializeData: InitializeRequestDto,
  ) {
    if (await this.servicesService.exists(serviceName)) {
      this.logger.log(
        `Updating service ${serviceName} with new data : 
        ${JSON.stringify(initializeData)}`,
      );
      await this.servicesService.update(serviceName, initializeData);
    } else {
      this.logger.log(
        `Creating service ${serviceName} with data :
        ${JSON.stringify(initializeData)}`,
      );
      await this.servicesService.create(initializeData);
    }
    return { message: 'Service initialized' };
  }

  @Post('/service/:serviceName/loggedIn')
  async loggedIn(
    @Param('serviceName') serviceName: string,
    @Body() dto: UserIdDto,
  ) {
    this.logger.log(`User ${dto.userId} logged in to service ${serviceName}`);
    if (
      !(await this.usersConnectionsService.connectionReferenceExists(
        dto.userId,
        serviceName,
      ))
    ) {
      this.logger.log(
        `Creating connection reference for user ${dto.userId} and service ${serviceName}`,
      );
      await this.usersConnectionsService.create(dto.userId, serviceName);
    } else {
      this.logger.log(
        `Updating connection reference to connected for user ${dto.userId} and service ${serviceName}`,
      );
      await this.usersConnectionsService.setConnected(
        dto.userId,
        serviceName,
        true,
      );
    }
    return { message: 'success' };
  }

  @Post('/service/:serviceName/loggedOut')
  async loggedOut(
    @Param('serviceName') serviceName: string,
    @Body() dto: UserIdDto,
  ) {
    this.logger.log(
      `User ${dto.userId} logged out from service ${serviceName}`,
    );
    await this.usersConnectionsService.setConnected(
      dto.userId,
      serviceName,
      false,
    );
    return { message: 'success' };
  }

  @Get()
  async listServices(@Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    this.logger.log(`Listing services for user ${user.id}`);
    return this.servicesService.listServicesPreview(user.id);
  }

  @Get(':serviceName/events')
  async listEvents(@Param('serviceName') serviceName: string) {
    this.logger.log(`Listing events for service ${serviceName}`);
    return this.servicesService.listEvents(serviceName);
  }

  @Get(':serviceName/actions')
  async listActions(@Param('serviceName') serviceName: string) {
    this.logger.log(`Listing actions for service ${serviceName}`);
    return this.servicesService.listActions(serviceName);
  }
}
