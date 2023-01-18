import {
  Controller,
  Response,
  Post,
  UseGuards,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UserSignupDto } from './users/dto/userSignup.dto';
import { UserLoginDto } from './users/dto/userLogin.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() userDto: UserLoginDto, @Response() res) {
    const result = await this.authService.login(userDto.email);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    return res.send({ message: 'success' });
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() userDto: UserSignupDto) {
    return this.authService.signup(userDto.email, userDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify() {
    return { message: 'success' };
  }
}
