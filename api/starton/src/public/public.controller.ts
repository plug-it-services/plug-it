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
import { UserService } from '../services/user.service';
import axios from 'axios';
import { StartonService } from 'src/services/starton.service';

@Controller('public')
export class PublicController {
  private logger = new Logger(PublicController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private startonService: StartonService,
  ) {}

  @Post('/apiKey')
  async apiKey(
    @Body(new ValidationPipe()) body: ApiKeyDto,
    @Headers('user') userHeader: string,
  ) {
    this.logger.log(`Receiving apiKey`);
    const user: { id: number } = JSON.parse(userHeader);
    await this.userService.create(user.id, body.apiKey);

    await axios.post(
      this.configService.getOrThrow<string>('PLUGS_SERVICE_LOGGED_IN_URL'),
      {
        userId: user.id,
      },
    );
    this.logger.log(`User ${user.id} connected to Starton`);

    return { message: 'success' };
  }

  @Post('/disconnect')
  async disconnect(@Response() res, @Headers('user') userHeader: string) {
    const user: { id: number } = JSON.parse(userHeader);

    this.logger.log(`Receiving disconnect for user ${user.id}`);
    await this.userService.delete(user.id);
    await axios.post(
      this.configService.getOrThrow<string>('PLUGS_SERVICE_LOGGED_OUT_URL'),
      {
        userId: user.id,
      },
    );
    this.logger.log(`User ${user.id} disconnected from Starton`);
    res.status(200).json({ message: 'success' });
  }

  @Post(':uuid')
  async onTrigger(@Body() body: any, @Param('uuid') uuid: string) {
    this.logger.log(`Received transaction for webhook ${uuid}`);

    switch (body.event) {
      case 'ADDRESS_RECEIVED_NATIVE_CURRENCY':
        this.startonService.addressReceivedNativeCurrencyParse(body, uuid);
        break;
      case 'ADDRESS_SENT_NATIVE_CURRENCY':
        this.startonService.addressSentNativeCurrencyParse(body, uuid);
        break;
      case 'ADDRESS_ACTIVITY':
        this.startonService.addressActivityParse(body, uuid);
        break;
      case 'EVENT_APPROVAL':
        this.startonService.eventApprovalParse(body, uuid);
        break;
      case 'EVENT_MINT':
        this.startonService.eventMintParse(body, uuid);
        break;
      case 'EVENT_TRANSFER':
        this.startonService.eventTransferParse(body, uuid);
        break;
      case 'ERC721_EVENT_TRANSFER':
        this.startonService.erc721EventTransferParse(body, uuid);
        break;
      case 'ERC1155_EVENT_TRANSFER_SINGLE':
        this.startonService.erc1155EventTransferSingleParse(body, uuid);
        break;
    }
    return { message: 'success' };
  }
}
