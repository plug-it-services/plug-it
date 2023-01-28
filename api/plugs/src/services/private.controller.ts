import { Body, Controller, Param, Post, Logger } from '@nestjs/common';
import { InitializeRequestDto } from './dto/InitializeRequest.dto';
import { ServicesService } from './services/services.service';
import UserIdDto from './dto/userId.dto';
import UsersConnectionsService from './services/usersConnections.service';

@Controller('/service')
export class PrivateServicesController {
  private readonly logger = new Logger(PrivateServicesController.name);
  constructor(
    private servicesService: ServicesService,
    private usersConnectionsService: UsersConnectionsService,
  ) {}

  @Post('/initialize')
  async initializeService(@Body() initializeData: InitializeRequestDto) {
    if (await this.servicesService.exists(initializeData.name)) {
      this.logger.log(
        `Updating service ${initializeData.name} with new data : 
        ${JSON.stringify(initializeData)}`,
      );
      await this.servicesService.update(initializeData.name, initializeData);
    } else {
      this.logger.log(
        `Creating service ${initializeData.name} with data :
        ${JSON.stringify(initializeData)}`,
      );
      await this.servicesService.create(initializeData);
    }
    return { message: 'Service initialized' };
  }

  @Post('/:serviceName/loggedIn')
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

  @Post('/:serviceName/loggedOut')
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
}
