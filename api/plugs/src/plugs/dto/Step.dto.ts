import { IsArray, IsString } from 'class-validator';
import { Field } from '../../dto/Field.dto';

export class Step {
  @IsString()
  serviceName: string;

  @IsString()
  id: string;

  @IsArray()
  fields: Field[];
}
