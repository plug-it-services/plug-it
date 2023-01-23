import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserConnectionDocument = HydratedDocument<UserConnection>;

@Schema({ autoIndex: true })
export default class UserConnection {
  @Prop({ required: true, index: true })
  userId: number;

  @Prop({ required: true })
  connected: boolean;

  @Prop({ required: true })
  service: string;
}

export const UserConnectionSchema =
  SchemaFactory.createForClass(UserConnection);
