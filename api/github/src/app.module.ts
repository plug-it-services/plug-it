import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { ListenerController } from './controllers/listen.controller';
import { PublicController } from './controllers/public.controller';

import { GithubAuthEntity } from './schemas/githubAuth.entity';
import { WebHookEntity } from './schemas/webhook.entity';

import { GithubAuthService } from './services/githubAuth.service';
import { GithubWatcherService } from './services/github.watcher.service';
import { GithubWebhookService } from './services/github.webhook.service';
import { GithubEventService } from './services/github.events.service';
import { WebHookService } from './services/webhook.service';
import { AmqpService } from './services/amqp.service';

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
          entities: [GithubAuthEntity, WebHookEntity],
        };
      },
    }),
    TypeOrmModule.forFeature([GithubAuthEntity, WebHookEntity]),
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
  controllers: [PublicController, ListenerController],
  providers: [
    GithubAuthService,
    GithubEventService,
    GithubWatcherService,
    WebHookService,
    GithubWebhookService,
    AmqpService,
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
