import { Field } from './Field.dto';

export class EventInitializeDto {
  plugId: string;

  eventId: string;

  userId: number;

  fields: Field[];
}
