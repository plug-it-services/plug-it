import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  lastname: string;
}
