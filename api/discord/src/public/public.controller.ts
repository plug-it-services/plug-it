import {
  Controller,
  Post,
  ValidationPipe,
  Headers,
  Body,
  Get,
  Response,
  Query,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscordService } from 'src/discord/discord.service';
import { DiscordAuthService } from 'src/discord/discordAuth.service';
import Oauth2StartDto from 'src/dto/Oauth2Start.dto';
import UserHeaderDto from 'src/dto/UserHeader.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('public')
export class PublicController {
  private logger = new Logger(PublicController.name);
  constructor(
    private discordService: DiscordService,
    private discordAuthService: DiscordAuthService,
    private configService: ConfigService,
  ) {}

  @Post('oauth2')
  async getAuthUrl(
    @Headers('user') userHeader: string,
    @Body(new ValidationPipe()) body: Oauth2StartDto,
  ) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    const token = this.discordService.token;
    const state = uuidv4();
    const redirectUri = `${this.configService.getOrThrow<string>(
      'API_URL',
    )}/discord/callback`;

    await this.discordAuthService.saveState(user.id, body.redirectUrl, state);

    return {
      url: `https://discord.com/api/oauth2/authorize?client_id=${token}&permissions=403727002688&scope=bot&state=${state}&redirect_uri=${redirectUri}`,
    };
  }

  @Post('disconnect')
  async disconnect(@Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    const discordUser = await this.discordAuthService.retrieveByUserId(user.id);

    await this.discordService.disconnectFromServer(discordUser.serverId);
    return { message: 'success' };
  }

  @Get('callback')
  async getAccessToken(
    @Response() res,
    @Body() body: any,
    @Query('state') state: string,
  ) {
    // TODO remove this log
    this.logger.log(body);
    this.logger.log(state);

    const user = await this.discordAuthService.retrieveByState(state);
    // TODO: Save server id

    res.redirect(user.redirectUrl);
  }
}
