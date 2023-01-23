import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export default class UserIdDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;
}
