import { IsArray, IsString } from 'class-validator';

export class Field {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class Step {
  @IsString()
  serviceName: string;

  @IsString()
  id: string;

  @IsArray()
  fields: Field[];
}
