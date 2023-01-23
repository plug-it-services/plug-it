import { AuthType } from './InitializeRequest.dto';

export type ServicePreviewDto = {
  name: string;
  connected: boolean;
  authType: AuthType;
  icon: string;
};
