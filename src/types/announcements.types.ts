export type ReactionType = '👍' | '❤️' | '😂' | '😮' | '😢' | '🔥';

export const REACTION_EMOTES: ReactionType[] = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export interface AnnouncementReaction {
  id: string;
  announcementId: string;
  visitorId: string;
  visitorName?: string;
  reaction: ReactionType;
  createdAt: string;
}

export interface AnnouncementView {
  id: string;
  announcementId: string;
  visitorId: string;
  visitorName?: string;
  viewedAt: string;
}

export interface AnnouncementSettings {
  enableViews: boolean;
  enableReactions: boolean;
  isPinned: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  isPinned: boolean;
  settings: AnnouncementSettings;
  viewCount: number;
  reactions: Record<ReactionType, number>;
  recentViewers: AnnouncementView[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high';
  isPublished?: boolean;
  settings?: Partial<AnnouncementSettings>;
}

export interface UpdateAnnouncementDto extends Partial<CreateAnnouncementDto> {
  isPinned?: boolean;
}

export interface AddReactionDto {
  announcementId: string;
  reaction: ReactionType;
  visitorId: string;
  visitorName?: string;
}

export interface RecordViewDto {
  announcementId: string;
  visitorId: string;
  visitorName?: string;
}
