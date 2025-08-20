import { handleAsync } from '@/shared/utils/handleAsync';
import api from '../api';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginRespose {
  authenticated: boolean;
  authorities: string[];
}

const BASE_URL = '/auth';

const authService = {
  login: (data: LoginRequest) => handleAsync(() => api.post<void>(`${BASE_URL}/login`, data), 'Welcome back!'),

  logout: () => handleAsync(() => api.post<void>(`${BASE_URL}/logout`, null), 'We hope to see you again!'),

  getAuthStatus: () => handleAsync(() => api.get<LoginRespose>(`${BASE_URL}/status`), false),
};

export default authService;
