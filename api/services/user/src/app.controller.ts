import {
  Controller,
  Response,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  ValidationPipe,
} from '@nestjs/common';
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
  async login(@Body() userDto: UserLoginDto, @Response() res) {
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
  @Get('verify')
  async verify(@Request() req, @Response() res) {
    const user = await this.userService.findOneById(req.user.id);
    const { password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars

    res.setHeader('user', JSON.stringify(result));
    res.send({ message: 'success' });
  }
}
