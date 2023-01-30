import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
});

export interface Error {
  message: string;
}

/*   Interfaces   */
export interface Service {
  name: string;
  authType: string;
  connected: boolean;
  icon: string;
}

export interface Plug {
  id: string;
  name: string;
  icons: string[];
  enabled: boolean;
}

export interface PlugDetail {
  id: string;
  name: string;
  activated: boolean;
  event: {
    serviceName: string;
    id: string;
    fields: {
      key: string;
      value: string;
    }[];
  };
  actions: {
    serviceName: string;
    id: string;
    fields: {
      key: string;
      value: string;
    }[];
  }[];
}
/*   END Interfaces   */

/*    GET    */
export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get('/services', {
      withCredentials: true,
      headers: {
        'crsf-token': localStorage.getItem('crsf-token') ?? '',
        Authorization: localStorage.getItem('crsf-token') ?? '',
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
    const response = await api.post('/plugs', plug);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
/*   END POST   */

export default api;
