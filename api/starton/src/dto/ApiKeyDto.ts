import { IsString } from 'class-validator';

export class ApiKeyDto {
  @IsString()
  apiKey: string;
}
