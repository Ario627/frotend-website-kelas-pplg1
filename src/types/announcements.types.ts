// Match dengan backend enum ReactionType
export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  HAHA = 'haha',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
}

// Mapping emoji untuk display
export const REACTION_EMOJI_MAP: Record<ReactionType, string> = {
  [ReactionType.LIKE]: '👍',
  [ReactionType.LOVE]: '❤️',
  [ReactionType.HAHA]: '😂',
  [ReactionType.WOW]: '😮',
  [ReactionType.SAD]: '😢',
  [ReactionType.ANGRY]: '😡',
};

export const REACTION_TYPES = Object.values(ReactionType);

export interface ReactionCount {
  type: ReactionType;
  count: number;
}

export interface AnnouncementView {
  id: number;
  announcementId: string;
  userId: number | null;
  visitorId: string | null;
  fingerprintHash: string | null;
  viewedAt: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
  isPinned: boolean;
  viewCount: number;
  reactions: ReactionCount[];
  userReaction?: ReactionType | null; // Reaction user yang sedang login (kalau ada)
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
  };
}

export interface AnnouncementWithStats extends Announcement {
  totalReactions: number;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  isActive?: boolean;
}

export interface UpdateAnnouncementDto extends Partial<CreateAnnouncementDto> {
  isPinned?: boolean;
}

// Socket event payloads (match dengan backend)
export interface ReactionUpdatePayload {
  announcementId: string;
  reactions: ReactionCount[];
  totalReactions: number;
  userId: number;
  reactionType: ReactionType | null;
  action: 'add' | 'remove';
}

export interface ViewUpdatePayload {
  announcementId: string;
  viewCount: number;
  viewer?: {
    id: number;
    name: string;
    viewedAt: Date;
  };
}
