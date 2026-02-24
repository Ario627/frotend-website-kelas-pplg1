import apiClient from "./client";
import type {
  GallerryPaginatedResponse,
  GalleryCategory,
  GalleryQueryParams,
} from '@/types/gallery.types';

export const galleryApi = {
  getAll: async (params?: GalleryQueryParams): Promise<GallerryPaginatedResponse> => {
    // Filter out undefined values to prevent sending them to the API
    const cleanParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ) : undefined;
    
    const response = await apiClient.get<GallerryPaginatedResponse>('/gallery', {
      params: cleanParams,
    });
    return response.data;
  },

  getCategories: async (): Promise<GalleryCategory[]> => {
    const response = await apiClient.get<GalleryCategory[]>('/gallery/categories');
    return response.data;
  },

  recordView: async (id: number): Promise<{ isNewView: boolean; viewCount: number }> => {
    const response = await apiClient.post<{ isNewView: boolean; viewCount: number }>(`/gallery/${id}/views`);
    return response.data;
  },
}
