import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  AuthType,
  EventDescription,
  ActionDescription,
} from '../dto/InitializeRequest.dto';
import String = mongoose.Schema.Types.String;

export type ServiceDocument = HydratedDocument<Service>;

@Schema({ autoIndex: true })
export class Service {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ required: true, type: String, enum: AuthType })
  authType: AuthType;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  events: EventDescription[];

  @Prop({ required: true })
  actions: ActionDescription[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
