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
  ValidationPipe, UnauthorizedException
} from "@nestjs/common";
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UserSignupDto } from './users/dto/userSignup.dto';
import { UserLoginDto } from './users/dto/userLogin.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
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
    await this.authService.signup(
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
}
