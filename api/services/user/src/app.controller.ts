import {
  Controller,
  Response,
  Request,
  Delete,
  Put,
  Post,
  UseGuards,
  Get,
  Body,
  ValidationPipe,
  UnauthorizedException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UserSignupDto } from './users/dto/userSignup.dto';
import { UserLoginDto } from './users/dto/userLogin.dto';
import { UsersService } from './users/users.service';
import { SsoLoginDto } from './sso/dto/ssoLogin.dto';
import SsoProvidersMappingService from './sso/ssoProvider.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private ssoProvidersMappingService: SsoProvidersMappingService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() userDto: UserLoginDto, @Response() res, @Request() req) {
    const csrfToken = req.get('crsf_token');
    if (!csrfToken) {
      throw new UnauthorizedException();
    }
    await this.userService.setCrsfToken(req.user.id, csrfToken);

    const result = await this.authService.login(userDto.email);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'strict',
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
  async update(@Request() req, @Body() userDto: UserSignupDto) {
    await this.userService.update(
      req.user.id,
      userDto.email,
      userDto.password,
      userDto.firstname,
      userDto.lastname,
    );
    return { message: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify(@Request() req, @Response() res) {
    const user = await this.userService.findOneById(req.user.id);
    const { password, crsfToken, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars

    if (!req.get('crsf_token') || crsfToken !== req.get('crsf_token')) {
      throw new UnauthorizedException();
    }

    res.setHeader('user', JSON.stringify(result));
    res.send({ message: 'success' });
  }

  @Post(':service/login')
  async socialLogin(
    @Body() ssoLoginDto: SsoLoginDto,
    @Param('service') service,
    @Request() req,
    @Response() res,
  ) {
    const csrfToken = req.get('crsf_token');
    if (!csrfToken) {
      throw new UnauthorizedException();
    }


    const provider = this.ssoProvidersMappingService.mapping.get(service);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    const profile = await provider.getUserProfile(ssoLoginDto.token);
    const result = await this.authService.ssoLoginOrSignup(
      profile.email,
      profile.firstName,
      profile.lastName,
    );
    await this.userService.setCrsfToken(result.id, csrfToken);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(200).send({ message: 'success' });
  }
}
