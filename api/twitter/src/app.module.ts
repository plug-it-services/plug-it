import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TwitterService } from './services/twitter.service';
import { ListenerController } from './controllers/listener.controller';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwitterAuthService } from './services/twitterAuth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterAuthEntity } from './schemas/twitterAuth.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      //imports: [ConfigModule],
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
          entities: [TwitterAuthEntity],
        };
      },
    }),
    TypeOrmModule.forFeature([TwitterAuthEntity]),
  ],
  controllers: [AppController, ListenerController],
  providers: [TwitterService, TwitterAuthService],
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
    const actionTriggerQueue = this.configService.getOrThrow<string>(
      'ACTION_TRIGGER_QUEUE',
    );
    await this.createQueue(eventInitializationQueue);
    await this.createQueue(actionTriggerQueue);
  }
}
