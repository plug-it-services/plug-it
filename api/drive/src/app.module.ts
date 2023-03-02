import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AppController } from './controllers/app.controller';
import { DriveAuthService } from './services/driveAuth.service';
import { DriveAuthEntity } from './schemas/driveAuth.entity';
import DriveChangesService from './services/driveChanges.service';
import FileActionsService from './services/fileActions.service';
import { WebHookService } from './services/webhook.service';
import { WebHookEntity } from './schemas/webhook.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          // TODO need to remove it in production
          synchronize: true,
          entities: [DriveAuthEntity],
        };
      },
    }),
    TypeOrmModule.forFeature([DriveAuthEntity, WebHookEntity]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          exchanges: [
            {
              name: 'amq.direct',
              type: 'direct',
            },
          ],
          uri: configService.getOrThrow<string>('RABBITMQ_URL'),
          enableControllerDiscovery: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    DriveAuthService,
    DriveChangesService,
    FileActionsService,
    WebHookService,
  ],
})
export class AppModule {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {}

  private async createQueue(queue: string) {
    await this.amqpConnection.channel.assertQueue(queue, {
      durable: true,
    });
    await this.amqpConnection.channel.bindQueue(queue, 'amq.direct', queue);
  }

  async onModuleInit() {
    const eventInitializationQueue = this.configService.getOrThrow<string>(
      'EVENT_INITIALIZATION_QUEUE',
    );
    const plugDisabledQueue = this.configService.getOrThrow<string>(
      'PLUG_DISABLED_QUEUE',
    );
    const actionTriggerQueue = this.configService.getOrThrow<string>(
      'ACTION_TRIGGER_QUEUE',
    );
    await this.createQueue(eventInitializationQueue);
    await this.createQueue(plugDisabledQueue);
    await this.createQueue(actionTriggerQueue);
  }
}
