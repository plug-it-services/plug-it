import {
  Controller,
  Post,
  ValidationPipe,
  Headers,
  Body,
  Get,
  Response,
  Query,
} from '@nestjs/common';
import Oauth2StartDto from 'dto/Oauth2Start.dto';
import UserHeaderDto from 'dto/UserHeader.dto';

@Controller('public')
export class PublicController {
  @Post('oauth2')
  async getAuthUrl(
    @Headers('user') userHeader: string,
    @Body(new ValidationPipe()) body: Oauth2StartDto,
  ) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    // TODO: Implement this
  }

  @Post('disconnect')
  async disconnect(@Headers('user') userHeader: string) {
    const user: UserHeaderDto = JSON.parse(userHeader);
    // TODO: Implement this
  }

  @Get('callback')
  async getAccessToken(
    @Response() res,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    // TODO: Implement this
  }
}
