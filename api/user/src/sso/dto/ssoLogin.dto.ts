import { IsString } from 'class-validator';

export class SsoLoginDto {
  @IsString()
  code: string;
}
