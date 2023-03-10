import { Injectable } from '@nestjs/common';
import { GoogleSsoService } from './google/googleSso.service';
import { SsoService } from './sso.service';

@Injectable()
export default class SsoProvidersMappingService {
  public readonly mapping = new Map<string, SsoService>();

  constructor(private googleSsoService: GoogleSsoService) {
    this.mapping.set('google', googleSsoService);
  }
}
