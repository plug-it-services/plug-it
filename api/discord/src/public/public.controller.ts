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
import axios from 'axios';
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
    const state = uuidv4();

    const url = new URL('https://discord.com/api/oauth2/authorize');

    url.searchParams.append(
      'client_id',
      this.configService.getOrThrow<string>('DISCORD_CLIENT_ID'),
    );
    url.searchParams.append(
      'client_secret',
      this.configService.getOrThrow<string>('DISCORD_CLIENT_SECRET'),
    );
    url.searchParams.append('permissions', '403727002688');
    url.searchParams.append('scope', 'bot');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('state', state);
    url.searchParams.append(
      'redirect_uri',
      `${this.configService.getOrThrow<string>(
        'API_URL',
      )}/service/discord/callback`,
    );

    await this.discordAuthService.saveState(user.id, body.redirectUrl, state);

    return { url };
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
    @Query('guild_id') server: string,
    @Query('code') code: string,
  ) {
    try {
      await axios.post('https://discord.com/api/oauth2/token', {
        body: {
          client_id: this.configService.getOrThrow<string>('DISCORD_CLIENT_ID'),
          client_secret: this.configService.getOrThrow<string>(
            'DISCORD_CLIENT_SECRET',
          ),
          grant_type: 'authorization_code',
          code,
          redirect_uri: `${this.configService.getOrThrow<string>(
            'API_URL',
          )}/service/discord/callback`,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (e) {
      console.error(e);
      this.logger.error(e.message);
    }

    const user = await this.discordAuthService.retrieveByState(state);

    this.logger.log(
      `User: ${JSON.stringify(user)} connect to server: ${server}`,
    );

    if (server) {
      await this.discordAuthService.saveState(
        user.userId,
        body.redirectUrl,
        state,
        server,
      );
    }

    res.redirect(user.redirectUrl);
  }
}
