import { IsNumber, IsString } from 'class-validator';

export default class UserHeaderDto {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
