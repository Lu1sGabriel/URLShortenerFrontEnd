import { handleAsync } from '@/shared/utils/handleAsync';
import api from '../api';

interface LoginRequest {
  email: string;
  password: string;
}

const BASE_URL = '/auth';

const AuthService = {
  login: (data: LoginRequest) => handleAsync(() => api.post(`${BASE_URL}/login`, data), 'Welcome back!'),

  logout: () => handleAsync(() => api.post(`${BASE_URL}/logout`, null), 'We hope to see you again!'),

  getAuthStatus: () => handleAsync(() => api.get(`${BASE_URL}/status`), false),
};

export default AuthService;
