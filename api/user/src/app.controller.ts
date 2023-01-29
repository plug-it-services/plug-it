import {
  Controller,
  Response,
  Request,
  UseGuards,
  Get,
  UnauthorizedException,
  Logger,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify(
    @Request() req,
    @Response() res,
    @Headers('crsf-token') crsfToken: string,
  ) {
    const user = await this.userService.findOneById(req.user.id);

    if (!crsfToken || user.crsfToken !== crsfToken) {
      this.logger.debug("CSRF token doesn't match");
      throw new UnauthorizedException();
    }

    res.setHeader(
      'user',
      JSON.stringify({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        id: user.id,
      }),
    );
    res.send({ message: 'success' });
  }
}
