import { IsString } from 'class-validator';

export class SsoLoginDto {
  @IsString()
  token: string;
}
