import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

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
  key: string;

  @IsEnum(ElementType)
  type: ElementType;

  @IsString()
  displayName: string;

  @IsString()
  description: string;
}

export class Field {
  @IsString()
  key: string;

  @IsEnum(ElementType)
  type: ElementType;

  @IsString()
  displayName: string;

  @IsBoolean()
  required: boolean;
}

export class EventDescription {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested()
  variables: Variable[];

  @IsArray()
  @ValidateNested()
  fields: Field[];
}

export class ActionDescription {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested()
  variables: Variable[];

  @IsArray()
  @ValidateNested()
  fields: Field[];
}

export class InitializeRequestDto {
  @IsString()
  name: string;

  @IsEnum(AuthType)
  authType: AuthType;

  @IsString()
  icon: string;

  @IsArray()
  @ValidateNested()
  events: EventDescription[];

  @IsArray()
  @ValidateNested()
  actions: ActionDescription[];
}
