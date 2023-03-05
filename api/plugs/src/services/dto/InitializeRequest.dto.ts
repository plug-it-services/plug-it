import {
  IsArray,
  IsBoolean,
  IsEnum, IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AuthType {
  NONE = 'none',
  API_KEY = 'apiKey',
  CLIENT_SECRET = 'clientSecret',
  OAUTH2 = 'oauth2',
}

export enum ElementType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
}

export class Variable {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsEnum(ElementType)
  type: ElementType;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  description: string;
}

export class Field {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsEnum(ElementType)
  type: ElementType;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsBoolean()
  required: boolean;
}

export class EventDescription {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Variable)
  variables: Variable[];

  @IsArray()
  @ValidateNested()
  @Type(() => Field)
  fields: Field[];
}

export class ActionDescription {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Variable)
  variables: Variable[];

  @IsArray()
  @ValidateNested()
  @Type(() => Field)
  fields: Field[];
}

export class InitializeRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AuthType)
  authType: AuthType;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsArray()
  @ValidateNested()
  @Type(() => EventDescription)
  events: EventDescription[];

  @IsArray()
  @ValidateNested()
  @Type(() => ActionDescription)
  actions: ActionDescription[];
}
