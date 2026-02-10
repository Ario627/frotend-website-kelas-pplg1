
import { apiClient } from './client'
import type {
    Announcement,
    CreateAnnouncementDto,
    PaginationResponse,
    UpdateAnnouncementDto
} from '@/types/api.types'

export const announcementsApi = {
    getActive: async () => {
        const response = await apiClient.get<PaginationResponse<Announcement>>(
            '/announcements'
        );
        return response.data;
    },

    getAll: async () => {
        const response = await apiClient.get<Announcement[]>(
            '/announcements/all'
        );
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get<Announcement>(`/announcements/${id}`);
        return response.data;
    },

    create: async (data: CreateAnnouncementDto) => {
        const response = await apiClient.post<Announcement>('/announcements', data);
        return response.data;
    },

    update: async (id: string, data: UpdateAnnouncementDto) => {
        const response = await apiClient.post<Announcement>(`/announcements/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete<{ message: string }>(`/announcements/${id}`);
        return response.data;
    }
}