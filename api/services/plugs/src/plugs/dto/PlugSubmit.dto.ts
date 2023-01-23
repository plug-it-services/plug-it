import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Step } from './Step.dto';

export class PlugSubmitDto {
  @IsString()
  name: string;

  @IsBoolean()
  enabled: boolean;

  @ValidateNested()
  event: Step;

  @ValidateNested()
  actions: Step[];
}
