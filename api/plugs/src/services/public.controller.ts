import { Controller, Param, Headers, Get, Logger } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import UserHeaderDto from '../dto/UserHeader.dto';

@Controller('public')
export class PublicServicesController {
  private readonly logger = new Logger(PublicServicesController.name);
  constructor(private servicesService: ServicesService) {}

  @Get('services')
  async listServices(@Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    this.logger.log(`Listing services for user ${user.id}`);
    return this.servicesService.listServicesPreview(user.id);
  }

  @Get('service/:serviceName/events')
  async listEvents(@Param('serviceName') serviceName: string) {
    this.logger.log(`Listing events for service ${serviceName}`);
    return this.servicesService.listEvents(serviceName);
  }

  @Get('service/:serviceName/actions')
  async listActions(@Param('serviceName') serviceName: string) {
    this.logger.log(`Listing actions for service ${serviceName}`);
    return this.servicesService.listActions(serviceName);
  }
}
