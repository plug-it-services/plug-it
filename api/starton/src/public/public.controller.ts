import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Param,
  Headers,
  Response,
} from '@nestjs/common';
import { ApiKeyDto } from '../dto/ApiKeyDto';
import { AmqpService } from '../services/amqp.service';
import { UserService } from '../services/user.service';
import { BN } from 'bn.js';

@Controller('public')
export class PublicController {
  constructor(
    private readonly amqpService: AmqpService,
    private userService: UserService,
  ) {}

  @Post('/apiKey')
  async apiKey(
    @Body(new ValidationPipe()) body: ApiKeyDto,
    @Headers('user') userHeader: string,
  ) {
    const user: { userId: number } = JSON.parse(userHeader);
    await this.userService.create(user.userId, body.apiKey);

    return { message: 'success' };
  }

  @Post('/disconnect')
  async disconnect(@Response() res, @Headers('user') userHeader: string) {
    const user: { userId: number } = JSON.parse(userHeader);

    await this.userService.delete(user.userId);
    res.status(200).json({ message: 'success' });
  }

  @Post(':uid')
  async onTrigger(@Body() body: any, @Param('id') uid: string) {
    const from = body.data.transaction.from;
    const to = body.data.transaction.to;
    const value = body.data.transaction.value.hex;
    const valueString = new BN(value, 16).toString(10);

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
    return { message: 'success' };
  }
}
