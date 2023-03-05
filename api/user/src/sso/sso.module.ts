import { Module } from '@nestjs/common';
import { GoogleSsoService } from './google/googleSso.service';
import SsoProvidersMappingService from './ssoProvider.service';

@Module({
  exports: [GoogleSsoService, SsoProvidersMappingService],
  providers: [GoogleSsoService, SsoProvidersMappingService],
})
export class SsoModule {}
