import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Param,
  Headers,
  Response,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKeyDto } from '../dto/ApiKeyDto';
import { AmqpService } from '../services/amqp.service';
import { UserService } from '../services/user.service';
import { WebHookService } from '../services/user.service';
import { BN } from 'bn.js';
import axios from 'axios';

@Controller('public')
export class PublicController {
  private logger = new Logger(PublicController.name);

  constructor(
    private readonly amqpService: AmqpService,
    private userService: UserService,
    private configService: ConfigService,
    private webhookService: WebHookService,
  ) {}

  @Post('/apiKey')
  async apiKey(
    @Body(new ValidationPipe()) body: ApiKeyDto,
    @Headers('user') userHeader: string,
  ) {
    this.logger.log(`Receiving apiKey`);
    const user: { id: number } = JSON.parse(userHeader);
    await this.userService.create(user.id, body.apiKey);

    await axios.post(this.configService.getOrThrow<string>('PLUGS_SERVICE_LOGGED_IN_URL'), {
      userId: user.id,
    });
    this.logger.log(`User ${user.id} connected to Starton`);

    return { message: 'success' };
  }

  @Post('/disconnect')
  async disconnect(@Response() res, @Headers('user') userHeader: string) {
    const user: { id: number } = JSON.parse(userHeader);

    this.logger.log(`Receiving disconnect for user ${user.id}`);
    await this.userService.delete(user.id);
    await axios.post(this.configService.getOrThrow<string>('PLUGS_SERVICE_LOGGED_OUT_URL'), {
      userId: user.id,
    });
    this.logger.log(`User ${user.id} disconnected from Starton`);
    res.status(200).json({ message: 'success' });
  }

  @Post(':uuid')
  async onTrigger(@Body() body: any, @Param('uuid') uid: string) {
    this.logger.log(`Received transaction for webhook ${uuid}`);
    const from = body.data.transaction.from;
    const to = body.data.transaction.to;
    const value = body.data.transaction.value.hex;
    const valueString = new BN(value.substr(2), 16).toString(10);
    const { uid } = this.webhookService.getWebhookById(uuid);

    const variables = [
      {
        key: 'from',
        value: from,
      },
      {
        key: 'to',
        value: to,
      },
      {
        key: 'value',
        value: valueString,
      },
    ];

    await this.amqpService.publish(
      'plugs_events',
      'addressReceivedNativeTokens',
      parseInt(uid),
      variables,
    );
    this.logger.log(`Published event for transaction of user ${uid}`);
    return { message: 'success' };
  }
}
