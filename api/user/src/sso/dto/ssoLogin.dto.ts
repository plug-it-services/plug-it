import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SsoLoginDto {
  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  codeType: 'idToken' | 'accessToken' = 'idToken';
}
