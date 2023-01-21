import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

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
}

export class EventDescription {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  variables: Variable[];

  @IsArray()
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
  variables: Variable[];

  @IsArray()
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
  events: EventDescription[];

  @IsArray()
  actions: ActionDescription[];
}
