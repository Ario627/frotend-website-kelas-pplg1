import apiClient from "./client";
import type {
  GallerryPaginatedResponse,
  GalleryCursorResponse,
  GalleryCategory,
  GalleryQueryParams,
  Album,
  AlbumDetail,
} from '@/types/gallery.types';

const cleanParams = (
  params?: GalleryQueryParams,
): Partial<GalleryQueryParams> | undefined =>
  params
    ? (Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined),
      ) as Partial<GalleryQueryParams>)
    : undefined;

export const galleryApi = {
  getAll: async (params?: GalleryQueryParams): Promise<GallerryPaginatedResponse> => {
    const response = await apiClient.get<GallerryPaginatedResponse>('/gallery', {
      params: cleanParams(params),
    });
    return response.data;
  },

  getAllCursor: async (params?: GalleryQueryParams): Promise<GalleryCursorResponse> => {
    const response = await apiClient.get<GalleryCursorResponse>('/gallery', {
      params: cleanParams(params),
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

  getAlbums: async (): Promise<Album[]> => {
    const response = await apiClient.get<Album[]>('/gallery/albums');
    return response.data;
  },

  getAlbumById: async (id: number): Promise<AlbumDetail> => {
    const response = await apiClient.get<AlbumDetail>(`/gallery/albums/${id}`);
    return response.data;
  },
};