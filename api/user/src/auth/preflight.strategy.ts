import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
@Injectable()
export class PreflightStrategy extends PassportStrategy(Strategy, 'preflight') {
  constructor() {
    super();
  }
  async validate(req: Request) {
    return req.headers['x-forwarded-method'] === 'OPTIONS';
  }
}
