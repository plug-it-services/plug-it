import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;
}
