import axios, { Axios } from 'axios';

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
});

export class ApiError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

/*   Interfaces   */
export type FieldValue = {
  key: string;
  value: string;
};

export interface Service {
  name: string;
  authType: 'none' | 'apiKey' | 'clientSecret' | 'oauth2';
  connected: boolean;
  icon: string;
}

export interface ServiceEvent {
  id: string;
  name: string;
  description: string;
  variables: {
    key: string;
    type: string;
    displayName: string;
    description: string;
  }[];
  fields: {
    type: string;
    key: string;
    displayName: string;
    required: boolean;
  }[];
}

export interface ServiceAction {
  id: string;
  name: string;
  description: string;
  variables: {
    key: string;
    type: string;
    displayName: string;
    description: string;
  }[];
  fields: {
    type: string;
    key: string;
    displayName: string;
    required: boolean;
  }[];
}

export interface Plug {
  id: string;
  name: string;
  icons: string[];
  enabled: boolean;
}

export interface PlugDetail {
  id?: string;
  name: string;
  enabled: boolean;
  event: {
    serviceName: string;
    id: string;
    fields: FieldValue[];
  };
  actions: {
    serviceName: string;
    id: string;
    fields: FieldValue[];
  }[];
}

/*   END Interfaces   */

const throwApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    throw new ApiError(error.response?.status ?? -1, error.response?.data?.message ?? 'Unknown error');
  }
  throw new ApiError(-1, 'Unknown error');
};

async function makeRequest(method: 'get' | 'post' | 'put', endpoint: string, data?: any): Promise<any> {
  try {
    if (method === 'get')
      return (
        await api.get('/services', {
          withCredentials: true,
          headers: {
            'crsf-token': localStorage.getItem('crsf-token') ?? '',
          },
        })
      ).data;
    if (method === 'post')
      return (
        await api.post('/services', data, {
          withCredentials: true,
          headers: {
            'crsf-token': localStorage.getItem('crsf-token') ?? '',
          },
        })
      ).data;
    if (method === 'put')
      return (
        await api.put('/services', data, {
          withCredentials: true,
          headers: {
            'crsf-token': localStorage.getItem('crsf-token') ?? '',
          },
        })
      ).data;
  } catch (error) {
    throwApiError(error);
  }
  throw new ApiError(-1, 'No matching method');
}

/*    GET    */
export const verify = async (): Promise<boolean> => {
  try {
    await makeRequest('get', '/auth/verify');
  } catch (err) {
    return false;
  }
  return true;
};

export const getServices = async (): Promise<Service[]> => makeRequest('get', '/services');

export const getServiceEvents = async (serviceName: string): Promise<ServiceEvent[]> =>
  makeRequest('get', `/service/${serviceName}/events`);

export const getServiceActions = async (serviceName: string): Promise<ServiceAction[]> =>
  makeRequest('get', `/service/${serviceName}/actions`);

export const getPlugs = async (): Promise<Plug[]> => makeRequest('get', '/plugs');
/*   END GET   */

/*    POST    */
export const postPlug = async (plug: PlugDetail): Promise<PlugDetail> => makeRequest('post', '/plugs', plug);

export const setPlugEnable = async (enable: boolean, id: string) =>
  makeRequest('put', `/plugs/${id}/enabled?enabled=${enable}`);

export const authService = async (service: Service, key: string): Promise<boolean> =>
  makeRequest('post', `/service/${service.name}/apiKey`, {
    apiKey: key,
  });

export const disconnectService = async (service: Service): Promise<boolean> =>
  makeRequest('post', `/service/${service.name}/disconnect`, {});

export const authOAuth2 = async (service: Service): Promise<string> =>
  makeRequest('post', `/service/${service.name}/oauth2`, {
    redirectUrl: `${process.env.REACT_APP_BASE_URL}/services`,
  });

/*   END POST   */

export default api;
