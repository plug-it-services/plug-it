import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PublicController } from './public/public.controller';
import { DiscordService } from './discord/discord.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordAuthEntity } from './entities/discordAuth.entity';
import { DiscordAuthService } from './discord/discordAuth.service';
import { AmqpService } from './amqp/amqp.service';
import { DiscordCommandEntity } from './entities/discordCommand.entity';
import { DiscordCommandService } from './discord/discordCommand.service';

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
          entities: [DiscordAuthEntity, DiscordCommandEntity],
        };
      },
    }),
    TypeOrmModule.forFeature([DiscordAuthEntity, DiscordCommandEntity]),
  ],
  controllers: [AppController, PublicController],
  providers: [
    DiscordService,
    DiscordAuthService,
    AmqpService,
    DiscordCommandService,
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
    const actionTriggerQueue = this.configService.getOrThrow<string>(
      'ACTION_TRIGGER_QUEUE',
    );
    await this.createQueue(eventInitializationQueue);
    await this.createQueue(actionTriggerQueue);
  }
}
