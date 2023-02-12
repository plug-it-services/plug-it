import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StartonService } from './services/starton.service';
import { PublicController } from './public/public.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AmqpService } from './services/amqp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { WebHookService } from './services/webhook.service';
import { WebHookEntity } from './entities/webhook.entity';

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
          entities: [UserEntity, WebHookEntity],
        };
      },
    }),
    TypeOrmModule.forFeature([UserEntity, WebHookEntity]),
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
  controllers: [AppController, PublicController],
  providers: [StartonService, AmqpService, UserService, WebHookService],
})
export class AppModule {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  private async createQueue(queue: string) {
    await this.amqpConnection.channel.assertQueue(queue, {
      durable: true,
    });
    await this.amqpConnection.channel.bindQueue(queue, 'amq.direct', queue);
  }

  async onModuleInit() {
    await this.createQueue('plug_event_starton_initialize');
    await this.createQueue('plug_action_starton_triggers');
    await this.createQueue('plug_event_starton_disabled');
  }
}
