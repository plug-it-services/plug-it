import {
  Controller,
  Response,
  Request,
  Delete,
  Put,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  UnauthorizedException,
  Param,
  NotFoundException,
  Logger,
  Get,
  Headers,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { SsoLoginDto } from 'src/sso/dto/ssoLogin.dto';
import SsoProvidersMappingService from 'src/sso/ssoProvider.service';
import { UserLoginDto } from 'src/users/dto/userLogin.dto';
import { UserSignupDto } from 'src/users/dto/userSignup.dto';
import { UsersService } from 'src/users/users.service';

@Controller('public')
export class PublicController {
  private logger = new Logger(PublicController.name);

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private ssoProvidersMappingService: SsoProvidersMappingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify(
    @Request() req,
    @Response() res,
    @Headers('crsf-token') crsfToken: string,
  ) {
    const user = await this.userService.findOneById(req.user.id);

    if (!crsfToken || user.crsfToken !== crsfToken) {
      this.logger.debug("CRSF token doesn't exist");
      throw new UnauthorizedException("CRSF token doesn't exist");
    }

    res.send({ message: 'success' });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() userDto: UserLoginDto,
    @Response() res,
    @Request() req,
    @Headers('crsf-token') crsfToken: string,
  ) {
    if (!crsfToken) {
      this.logger.error("CRSF token doesn't exist");
      throw new UnauthorizedException("CRSF token doesn't exist");
    }
    await this.userService.setCrsfToken(req.user.id, crsfToken);

    const result = await this.authService.login(userDto.email);
    res.cookie('access_token', result.access_token, {
      sameSite: 'none',
      secure: true,
      path: '/'
    });
    res.status(200).send({ message: 'success' });
  }

  @Post('signup')
  async signup(@Body(new ValidationPipe()) userDto: UserSignupDto) {
    await this.authService.basicSignup(
      userDto.email,
      userDto.password,
      userDto.firstname,
      userDto.lastname,
    );
    return { message: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Response() res) {
    res.clearCookie('access_token');
    await this.userService.setCrsfToken(req.user.id, null);

    res.status(200).send({ message: 'success' });
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Request() req) {
    await this.userService.remove(req.user.id);
    return { message: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(
    @Request() req,
    @Body(new ValidationPipe()) userDto: UserSignupDto,
  ) {
    await this.userService.update(
      req.user.id,
      userDto.email,
      userDto.password,
      userDto.firstname,
      userDto.lastname,
    );
    return { message: 'success' };
  }

  @Post(':service/login')
  async socialLogin(
    @Body(new ValidationPipe()) ssoLoginDto: SsoLoginDto,
    @Param('service') service,
    @Response() res,
    @Headers('crsf-token') crsfToken: string,
  ) {
    if (!crsfToken) {
      this.logger.error("CRSF token doesn't match");
      throw new UnauthorizedException();
    }

    const provider = this.ssoProvidersMappingService.mapping.get(service);
    if (!provider) {
      this.logger.error(`${service} provider doesn't exist to log in`);
      throw new NotFoundException('Provider not found');
    }
    const profile = await provider.getUserProfile(ssoLoginDto.code);
    const result = await this.authService.ssoLoginOrSignup(
      profile.email,
      profile.firstName,
      profile.lastName,
    );
    await this.userService.setCrsfToken(result.id, crsfToken);
    res.cookie('access_token', result.access_token, {
      sameSite: 'none',
      secure: true,
      path: '/'
    });
    res.status(200).send({ message: 'success' });
  }
}
