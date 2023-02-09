import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Step } from './Step.dto';
import { Type } from 'class-transformer';

export class PlugSubmitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;

  @ValidateNested()
  @Type(() => Step)
  event: Step;

  @ValidateNested({ each: true })
  @Type(() => Step)
  actions: Step[];
}
