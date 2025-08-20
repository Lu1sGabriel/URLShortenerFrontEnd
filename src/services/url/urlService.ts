import { handleAsync } from '@/shared/utils/handleAsync';
import api from '../api';

interface UrlRequest {
  urlName: string;
  url: string;
}

interface UrlResponse {
  id: string;
  urlName: string;
  url: string;
  shortened: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const BASE_URL = '/api/v1/url';

const urlService = {
  getByUser: () => handleAsync(() => api.get<UrlResponse[]>(`${BASE_URL}/all-user-urls`), false),

  redirect: (shortened: string) => {
    window.open(`http://localhost:8080/redirector/${shortened}`, '_blank');
  },

  create: (data: UrlRequest) => handleAsync(() => api.post<UrlResponse>(`${BASE_URL}`, data)),

  changeUrlName: (id: string, urlName: string) => handleAsync(() => api.patch<UrlResponse>(`${BASE_URL}/change/url-name`, { id, urlName })),

  changeUrl: (id: string, url: string) => handleAsync(() => api.patch<UrlResponse>(`${BASE_URL}/change/url`, { id, url })),

  delete: (id: string) => handleAsync(() => api.delete<void>(`${BASE_URL}/${id}`)),
};

export default urlService;
