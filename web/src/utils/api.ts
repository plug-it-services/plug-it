import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
});

export interface Error {
  message: string;
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

/*    GET    */
export const verify = async (): Promise<boolean> => {
  try {
    await api.get('/auth/verify', {
      withCredentials: true,
      headers: {
        'crsf-token': localStorage.getItem('crsf-token') ?? '',
      },
    });
  } catch (err) {
    return false;
  }
  return true;
};

export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get('/services', {
      withCredentials: true,
      headers: {
        'crsf-token': localStorage.getItem('crsf-token') ?? '',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getServiceEvents = async (serviceName: string): Promise<ServiceEvent[]> => {
  try {
    const response = await api.get(`/service/${serviceName}/events`, {
      withCredentials: true,
      headers: {
        'crsf-token': localStorage.getItem('crsf-token') ?? '',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getServiceActions = async (serviceName: string): Promise<ServiceAction[]> => {
  try {
    const response = await api.get(`/service/${serviceName}/actions`, {
      withCredentials: true,
      headers: {
        'crsf-token': localStorage.getItem('crsf-token') ?? '',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPlugs = async (): Promise<Plug[]> => {
  try {
    const response = await api.get('/plugs', {
      headers: {
        'crsf-token': localStorage.getItem('crsf-token') ?? '',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
/*   END GET   */

/*    POST    */
export const postPlug = async (plug: PlugDetail): Promise<boolean> => {
  try {
    const response = await api.post('/plugs', plug, {
      headers: {
        'crsf-token': localStorage.getItem('crsf-token') ?? '',
      },
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const setPlugEnable = async (enable: boolean, id: string) => {
  try {
    await api.put(
      `/plugs/${id}/enabled?enabled=${enable}`,
      {},
      {
        headers: {
          'crsf-token': localStorage.getItem('crsf-token') ?? '',
        },
        withCredentials: true,
      },
    );
  } catch (error) {
    console.error(error);
  }
};

export const authService = async (service: Service, key: string) : Promise<boolean> => {
  try {
    await api.post(
      `/service/${service.name}/apiKey`,
      {
        apiKey: key,
      },
      {
        headers: {
          'crsf-token': localStorage.getItem('crsf-token'),
        },
        withCredentials: true,
      },
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const disconnectService = async (service: Service): Promise<boolean> => {
  try {
    await api.post(
      `/service/${service.name}/disconnect`,
      {},
      {
        headers: {
          'crsf-token': localStorage.getItem('crsf-token'),
        },
        withCredentials: true,
      },
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const authOAuth2 = async (service: Service): Promise<string> => {
  try {
    const res = await api.post(
      `/service/${service.name}/oauth2`,
      {
        redirectUrl: `${process.env.REACT_APP_BASE_URL}/services`,
      },
      {
        headers: {
          'crsf-token': localStorage.getItem('crsf-token'),
        },
        withCredentials: true,
      },
    );
    return res.data.url;
  } catch (err) {
    console.log(err);
    return '';
  }
};

// TODO for every function : throw a standard object in case of failure containing at least status + message

/*   END POST   */

export default api;
