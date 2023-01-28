import { IsString } from 'class-validator';

export class Variable {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
