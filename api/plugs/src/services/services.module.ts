import { Module } from '@nestjs/common';
import { PublicServicesController } from './public.controller';
import { ServicesService } from './services/services.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceSchema } from './schemas/service.schema';
import { UserConnectionSchema } from './schemas/usersConnection.schema';
import UsersConnectionsService from './services/usersConnections.service';
import { PrivateServicesController } from './private.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Service', schema: ServiceSchema },
      { name: 'UserConnection', schema: UserConnectionSchema },
    ]),
  ],
  controllers: [PublicServicesController, PrivateServicesController],
  providers: [ServicesService, UsersConnectionsService],
  exports: [ServicesService],
})
export class ServicesModule {}
