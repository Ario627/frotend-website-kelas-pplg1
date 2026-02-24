export type GalleryType = 'image' | 'video';

export interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  type: GalleryType;
  cloudinaryPublicId: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  format: string | null;
  youtubeVideoId: string | null;
  category: string | null;
  tags: string[];
  order: number;
  isPublished: boolean;
  viewCount: number;
  enableViews: boolean;
  uploadedById: number | null;
  uploadedBy?: {
    id: number;
    name: string;
  };
  uploadedAt: string;
  createdAt: string;
}

export interface GallerryPaginatedResponse {
  data: GalleryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GalleryCategory {
  category: string;
  count: number;
}

export interface GalleryQueryParams {
  type?: GalleryType;
  category?: string;
  page?: number;
  limit?: number;
}
