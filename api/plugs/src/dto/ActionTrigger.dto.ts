import { Field } from './Field.dto';

export class ActionTriggerDto {
  actionId: string;

  userId: number;

  runId: string;

  fields: Field[];
}
