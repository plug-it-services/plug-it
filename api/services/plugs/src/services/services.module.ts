import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services/services.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceSchema } from './entity/service.schema';
import { UserConnectionSchema } from './entity/usersConnection.schema';
import UsersConnectionsService from './services/usersConnections.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Service', schema: ServiceSchema },
      { name: 'UserConnection', schema: UserConnectionSchema },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService, UsersConnectionsService],
})
export class ServicesModule {}
