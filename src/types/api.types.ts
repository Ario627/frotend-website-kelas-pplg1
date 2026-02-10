export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
  expiresAt: string | null;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
  };
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  expiresAt?: string;
}

export interface UpdateAnnouncementDto extends Partial<CreateAnnouncementDto> {
  isActive?: boolean;
}