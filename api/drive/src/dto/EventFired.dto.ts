import { Variable } from './Variable.dto';

export class EventFiredDto {
  serviceName: string;
  eventId: string;
  plugId: string;
  userId: number;
  variables: Variable[];
}
