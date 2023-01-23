import { Step } from './Step.dto';

export class PlugDescriptionDto {
  id: string;
  name: string;
  enabled: boolean;
  event: Step;
  actions: Step[];
}
