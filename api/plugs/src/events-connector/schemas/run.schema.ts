import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Variable } from '../../dto/Variable.dto';

export type RunDocument = HydratedDocument<Run>;

@Schema({ autoIndex: true })
export class Run {
  @Prop({ required: true })
  plugId: string;

  @Prop({ required: true })
  stepIdx: number;

  @Prop({ required: true })
  variables: Variable[][];
}

export const RunSchema = SchemaFactory.createForClass(Run);
