import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlugDocument = HydratedDocument<Plug>;

export class Field {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;
}

export class Step {
  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true, index: true })
  correlationId: string;

  @Prop({ required: true })
  fields: Field[];
}

@Schema({ autoIndex: true })
export class Plug {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true })
  owner: number;

  @Prop({ required: true })
  enabled: boolean;

  @Prop({ required: true })
  event: Step;

  @Prop({ required: true })
  actions: Step[];
}

export const PlugSchema = SchemaFactory.createForClass(Plug);
//PlugSchema.index()
