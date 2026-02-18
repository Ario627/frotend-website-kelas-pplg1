import apiClient from './client';
import type {
  Announcement,
  AnnouncementWithStats,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  ReactionType,
  ReactionCount,
  AnnouncementView,
} from '@/types/announcements.types';
import type { PaginationResponse } from '@/types/api.types';

export const announcementsApi = {
  // Public - get active announcements
  getActive: async (): Promise<AnnouncementWithStats[]> => {
    const response = await apiClient.get<AnnouncementWithStats[]>('/announcements');
    return response.data;
  },

  // Public - get single announcement
  getById: async (id: string): Promise<AnnouncementWithStats> => {
    const response = await apiClient.get<AnnouncementWithStats>(`/announcements/${id}`);
    return response.data;
  },

  // Admin only - get all announcements
  getAll: async (): Promise<AnnouncementWithStats[]> => {
    const response = await apiClient.get<AnnouncementWithStats[]>('/announcements/admin/all');
    return response.data;
  },

  // Admin only - create
  create: async (data: CreateAnnouncementDto): Promise<AnnouncementWithStats> => {
    const response = await apiClient.post<AnnouncementWithStats>('/announcements', data);
    return response.data;
  },

  // Admin only - update
  update: async (id: string, data: UpdateAnnouncementDto): Promise<AnnouncementWithStats> => {
    const response = await apiClient.patch<AnnouncementWithStats>(`/announcements/${id}`, data);
    return response.data;
  },

  // Admin only - toggle pin
  togglePin: async (id: string): Promise<AnnouncementWithStats> => {
    const response = await apiClient.patch<AnnouncementWithStats>(`/announcements/${id}/pin`);
    return response.data;
  },

  // Admin only - delete
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/announcements/${id}`);
  },

  // Public - add reaction (identity resolved by backend via cookie/JWT)
  addReaction: async (id: string, reactionType: ReactionType): Promise<{ reaction: any; counts: ReactionCount[] }> => {
    const response = await apiClient.post(`/announcements/${id}/reactions`, {
      reactionType,
    });
    return response.data;
  },

  // Authenticated only - remove reaction
  removeReaction: async (id: string): Promise<{ counts: ReactionCount[] }> => {
    const response = await apiClient.delete(`/announcements/${id}/reactions`);
    return response.data;
  },

  // Public - record view (identity resolved by backend)
  recordView: async (id: string): Promise<{ isNewView: boolean; viewCount: number }> => {
    const response = await apiClient.post(`/announcements/${id}/views`);
    return response.data;
  },

  // Admin only - get viewers
  getViewers: async (id: string): Promise<AnnouncementView[]> => {
    const response = await apiClient.get<AnnouncementView[]>(`/announcements/${id}/viewers`);
    return response.data;
  },
};
