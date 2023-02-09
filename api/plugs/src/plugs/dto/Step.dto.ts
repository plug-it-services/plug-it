import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Field } from '../../dto/Field.dto';
import { Type } from 'class-transformer';

export class Step {
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested({ each: true })
  @Type(() => Field)
  fields: Field[];
}
