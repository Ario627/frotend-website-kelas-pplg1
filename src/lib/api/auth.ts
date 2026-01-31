import apiClient from "./client";
import type {
  LoginCredentials,
  RegistrationData,
  User,
  LoginResponse,
  RegistrationResponse
} from '@/types/user.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegistrationData): Promise<RegistrationResponse> => {
    const response = await apiClient.post<RegistrationResponse>('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }


}
