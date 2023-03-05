import { Variable } from './Variable.dto';

export class ActionFinishedDto {
  serviceName: string;

  actionId: string;

  plugId: string;

  userId: number;

  runId: string;

  variables: Variable[];
}
