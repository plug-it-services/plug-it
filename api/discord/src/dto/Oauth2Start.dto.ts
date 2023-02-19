import { IsNotEmpty, IsString } from 'class-validator';

export default class Oauth2StartDto {
  @IsString()
  @IsNotEmpty()
  redirectUrl: string;
}
