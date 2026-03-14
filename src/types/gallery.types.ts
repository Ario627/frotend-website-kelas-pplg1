export type GalleryType = 'image' | 'video' | 'live_photo';

export interface ResponsiveUrls {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  full: string;
}

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
  isLivePhoto: boolean;
  liveVideoPublicId: string | null;
  liveVideoUrl: string | null;
  liveVideoDuration: number | null;
  liveVideoMp4Url: string | null;
  responsive: ResponsiveUrls | null;
  category: string | null;
  tags: string[];
  order: number;
  isPublished: boolean;
  viewCount: number;
  enableViews?: boolean;
  uploadedById?: number | null;
  uploadedBy?: {
    id: number;
    name: string;
  };
  uploadedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GallerryPaginatedResponse {
  data: GalleryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GalleryCursorResponse {
  data: GalleryItem[];
  meta: {
    hasMore: boolean;
    nextCursor: number | null;
    total: number;
  };
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
  cursor?: number;
}

export interface Album {
  id: number;
  title: string;
  description: string | null;
  coverPublicId?: string | null;
  coverUrl: string | null;
  order?: number;
  isPublished: boolean;
  itemCount: number;
  createdById?: number;
  createdBy: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AlbumDetail extends Album {
  items: GalleryItem[];
}
