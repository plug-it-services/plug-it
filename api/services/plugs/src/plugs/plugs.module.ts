import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PlugsService } from './plugs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlugSchema } from './schemas/plug.schema';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Plug', schema: PlugSchema }]),
    ServicesModule,
  ],
  controllers: [PublicController],
  providers: [PlugsService],
})
export class PlugsModule {}
