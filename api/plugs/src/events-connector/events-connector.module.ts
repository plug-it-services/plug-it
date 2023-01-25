import { forwardRef, Module } from '@nestjs/common';
import { EventsConnectorService } from './services/events-connector.service';
import { EventsConnectorController } from './events-connector.controller';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { PlugsModule } from '../plugs/plugs.module';
import { RunsService } from './services/runs.service';
import { VariablesService } from './services/variables.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RunSchema } from './schemas/run.schema';

@Module({
  imports: [
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
    MongooseModule.forFeature([{ name: 'Run', schema: RunSchema }]),
    forwardRef(() => PlugsModule),
  ],
  providers: [EventsConnectorService, RunsService, VariablesService],
  controllers: [EventsConnectorController],
  exports: [EventsConnectorService],
})
export class EventsConnectorModule {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {}

  private async createQueue(queue: string, routingKey: string) {
    await this.amqpConnection.channel.assertQueue(queue, {
      durable: true,
    });
    await this.amqpConnection.channel.bindQueue(
      queue,
      'amq.direct',
      routingKey,
    );
  }

  async onModuleInit() {
    const queues = this.configService.getOrThrow<string>('PLUGS_QUEUES');
    const routingKeys =
      this.configService.getOrThrow<string>('PLUGS_ROUTING_KEYS');
    const queuesArray = queues.split(', ');
    const routingKeysArray = routingKeys.split(', ');

    if (queuesArray.length !== routingKeysArray.length) {
      throw new Error(
        'PLUGS_QUEUES and PLUGS_ROUTING_KEYS must have the same length',
      );
    }
    for (let i = 0; i < queuesArray.length; i++) {
      await this.createQueue(queuesArray[i], routingKeysArray[i]);
    }
  }
}
