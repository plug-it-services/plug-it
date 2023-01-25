import { Field } from './Field.dto';

export class EventInitializeDto {
  eventId: string;

  userId: number;

  fields: Field[];
}
