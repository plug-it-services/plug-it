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
import { UserDto } from './users/user.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() userDto: UserDto, @Response() res) {
    const result = await this.authService.login(userDto.email);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    return res.send({ message: 'success' });
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() userDto: UserDto) {
    return this.authService.signup(userDto.email, userDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify() {
    return { message: 'success' };
  }
}
