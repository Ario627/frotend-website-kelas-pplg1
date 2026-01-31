import apiClient from "./client";
import type {
  User,
  UpdateUserDto,
  // ada satu lagi tapi nanti
  PendingUser,
  ApproveUserDto,
  RejectUserDto
} from '@/types/user.types';
import type { PaginationResponse } from "@/types/api.types";

export const usersApi = {
  getAll: async (page = 1, limit = 20, status?: string) => {
    const response = await apiClient.get<PaginationResponse<User>>(
      '/users',
      { params: { page, limit, status } }
    );
    return response.data;
  },

  getPending: async () => {
    const response = await apiClient.get<PendingUser[]>('/users/pending');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto) => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  approve: async (data: ApproveUserDto) => {
    const response = await apiClient.post<User>('/users/approve', data);
    return response.data;
  },

  reject: async (data: RejectUserDto) => {
    const response = await apiClient.post<User>('/users/reject', data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }
}
