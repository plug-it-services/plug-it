import { FieldEdition, Variable } from '../utils/api';

export enum StepType {
  EVENT,
  ACTION,
}

export type StepInfo = {
  type: StepType;
  serviceName: string;
  stepId: string;
  fields: FieldEdition[];
  variables: Variable[];
};
