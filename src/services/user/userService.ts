import { handleAsync } from '@/shared/utils/handleAsync';
import api from '../api';

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChangeUserPassword {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

const BASE_URL = '/api/v1/user';

const userService = {
  viewProfile: () => handleAsync(() => api.get<UserResponse>(`${BASE_URL}/view-profile`), false),

  create: (data: UserRequest) => handleAsync(() => api.post<UserResponse>(`${BASE_URL}`, data)),

  changeName: (name: string) => handleAsync(() => api.patch<UserResponse>(`${BASE_URL}/change/name`, { name })),

  changeEmail: (email: string) => handleAsync(() => api.patch<UserResponse>(`${BASE_URL}/change/email`, { email })),

  changePassword: (data: ChangeUserPassword) => handleAsync(() => api.patch<UserResponse>(`${BASE_URL}/change/password`, data)),

  deactivate: () => handleAsync(() => api.delete<void>(`${BASE_URL}`), false),
};

export default userService;
