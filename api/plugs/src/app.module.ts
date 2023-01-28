import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServicesModule } from './services/services.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PlugsModule } from './plugs/plugs.module';
import { EventsConnectorModule } from './events-connector/events-connector.module';

@Module({
  imports: [
    ServicesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get<string>('PLUGS_MONGO_URI'));
        return {
          uri: configService.get<string>('PLUGS_MONGO_URI'),
        };
      },
    }),
    PlugsModule,
    EventsConnectorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
