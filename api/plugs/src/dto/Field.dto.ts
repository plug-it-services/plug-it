import { IsString } from 'class-validator';

export class Field {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
