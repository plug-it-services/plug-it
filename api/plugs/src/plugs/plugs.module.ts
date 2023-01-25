import { forwardRef, Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PlugsService } from './plugs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlugSchema } from './schemas/plug.schema';
import { ServicesModule } from '../services/services.module';
import { EventsConnectorModule } from '../events-connector/events-connector.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Plug', schema: PlugSchema }]),
    ServicesModule,
    forwardRef(() => EventsConnectorModule),
  ],
  controllers: [PublicController],
  providers: [PlugsService],
  exports: [PlugsService],
})
export class PlugsModule {}
