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
    @Headers('X-Forwarded-Method') method: string,
  ) {
    console.log(`try header method: ${method}`);
    // This is a workaround for the preflight request
    if (method === 'OPTIONS') {
      return res.send({ message: 'success' });
    }

    const user = await this.userService.findOneById(req.user.id);

    if (!crsfToken || user.crsfToken !== crsfToken) {
      this.logger.debug("CRSF token doesn't exist");
      throw new UnauthorizedException("CRSF token doesn't exist");
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
