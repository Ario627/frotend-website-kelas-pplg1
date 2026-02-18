'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback, useRef } from "react";
import { announcementsApi } from "@/lib/api/announcements";
import { useSocket } from "@/providers/socket-provider";
import { toast } from "sonner";
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  ReactionType,
  AnnouncementWithStats,
  ReactionUpdatePayload,
  ViewUpdatePayload,
} from "@/types/announcements.types";

export function useAnnouncements() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['announcements', 'active'],
    queryFn: announcementsApi.getActive,
    staleTime: 1000 * 60, // 1 minute
  });

  useEffect(() => {
    if (!socket) return;

    const handleNew = (announcement: AnnouncementWithStats) => {
      queryClient.setQueryData<AnnouncementWithStats[]>(
        ['announcements', 'active'],
        (old) => old ? [announcement, ...old] : [announcement]
      );
      toast.success(`Announcement viewed: ${announcement.title}`);
    };

    const handleUpdate = (announcement: AnnouncementWithStats) => {
      queryClient.setQueryData<AnnouncementWithStats[]>(
        ['announcements', 'active'],
        (old) => old?.map((a) => a.id === announcement.id ? announcement : a) ?? []
      );
    };

    const handleDelete = ({ id }: { id: string }) => {
      queryClient.setQueryData<AnnouncementWithStats[]>(
        ['announcements', 'active'],
        (old) => old?.filter((a) => a.id !== id) ?? []
      );
    };

    const handlePin = ({ id, isPinned }: { id: string; isPinned: boolean }) => {
      queryClient.setQueryData<AnnouncementWithStats[]>(
        ['announcements', 'active'],
        (old) => old?.map((a) => a.id === id ? { ...a, isPinned } : a) ?? []
      );
    };

    const handleReaction = (data: ReactionUpdatePayload) => {
      queryClient.setQueryData<AnnouncementWithStats[]>(
        ['announcements', 'active'],
        (old) => old?.map((a) =>
          a.id === data.announcementId
            ? { ...a, reactions: data.reactions, totalReactions: data.totalReactions }
            : a
        ) ?? []
      );
    };

    const handleView = (data: ViewUpdatePayload) => {
      queryClient.setQueryData<AnnouncementWithStats[]>(
        ['announcements', 'active'],
        (old) => old?.map((a) =>
          a.id === data.announcementId
            ? { ...a, viewCount: data.viewCount }
            : a
        ) ?? []
      );
    };

    socket.on('announcement:new', handleNew);
    socket.on('announcement:update', handleUpdate);
    socket.on('announcement:delete', handleDelete);
    socket.on('announcement:pin', handlePin);
    socket.on('announcement:reaction', handleReaction);
    socket.on('announcement:view', handleView);

    return () => {
      socket.off('announcement:new', handleNew);
      socket.off('announcement:update', handleUpdate);
      socket.off('announcement:delete', handleDelete);
      socket.off('announcement:pin', handlePin);
      socket.off('announcement:reaction', handleReaction);
      socket.off('announcement:view', handleView);
    };
  }, [socket, queryClient]);

  return query;
}

export function useAlllAnnouncements(id: string) {
  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => announcementsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementDto) => announcementsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement created');
    },
    onError: () => {
      toast.error('Failed to create announcement');
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementDto }) =>
      announcementsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Pengumuman berhasil diupdate!');
    },
    onError: () => {
      toast.error('Gagal mengupdate pengumuman');
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => announcementsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Pengumuman berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus pengumuman');
    },
  });
}

export function usePinAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => announcementsApi.togglePin(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['announcements', 'active'] });

      const previousData = queryClient.getQueryData<AnnouncementWithStats[]>(['announcements', 'active']);

      queryClient.setQueryData<AnnouncementWithStats[]>(
        ['announcements', 'active'],
        (old) => old?.map((a) => a.id === id ? { ...a, isPinned: !a.isPinned } : a) ?? []
      );

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['announcements', 'active'], context.previousData);
      }
      toast.error('Gagal mengubah pin');
    },
    onSuccess: (data) => {
      toast.success(data.isPinned ? 'Pengumuman di-pin!' : 'Pin dihapus');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useAddReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      announcementId,
      reactionType
    }: {
      announcementId: string;
      reactionType: ReactionType;
    }) => {
      const result = await announcementsApi.addReaction(announcementId, reactionType);
      return result;
    },

    onMutate: async ({ announcementId, reactionType }) => {
      await queryClient.cancelQueries({ queryKey: ['announcements', 'active'] });

      const previousData = queryClient.getQueryData<AnnouncementWithStats[]>(['announcements', 'active']);

      queryClient.setQueryData<AnnouncementWithStats[]>(
        ['announcements', 'active'],
        (old) => old?.map((a) => {
          if (a.id !== announcementId) return a;

          const newCounts = [...(a.reactions || [])].map(r => ({ ...r }));
          const prevReaction = a.userReaction;

          // If switching from a previous reaction, decrement old one
          if (prevReaction && prevReaction !== reactionType) {
            const oldIdx = newCounts.findIndex(r => r.type === prevReaction);
            if (oldIdx >= 0) {
              newCounts[oldIdx] = { ...newCounts[oldIdx], count: Math.max(0, newCounts[oldIdx].count - 1) };
            }
          }

          // Increment new reaction
          const newIdx = newCounts.findIndex(r => r.type === reactionType);
          if (newIdx >= 0) {
            newCounts[newIdx] = { ...newCounts[newIdx], count: newCounts[newIdx].count + 1 };
          } else {
            newCounts.push({ type: reactionType, count: 1 });
          }

          return {
            ...a,
            reactions: newCounts.filter(r => r.count > 0),
            userReaction: reactionType,
          };
        }) ?? []
      );

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['announcements', 'active'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useRemoveReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcementId: string) => {
      const result = await announcementsApi.removeReaction(announcementId);
      return result;
    },

    onMutate: async (announcementId) => {
      await queryClient.cancelQueries({ queryKey: ['announcements', 'active'] });

      const previousData = queryClient.getQueryData<AnnouncementWithStats[]>(['announcements', 'active']);

      queryClient.setQueryData<AnnouncementWithStats[]>(
        ['announcements', 'active'],
        (old) => old?.map((a) => {
          if (a.id !== announcementId) return a;

          const prevReaction = a.userReaction;
          if (!prevReaction) return a;

          const newCounts = [...(a.reactions || [])].map(r => ({ ...r }));
          const idx = newCounts.findIndex(r => r.type === prevReaction);
          if (idx >= 0) {
            newCounts[idx] = { ...newCounts[idx], count: Math.max(0, newCounts[idx].count - 1) };
          }

          return {
            ...a,
            reactions: newCounts.filter(r => r.count > 0),
            userReaction: null,
          };
        }) ?? []
      );

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['announcements', 'active'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useRecordView() {
  const viewedRef = useRef<Set<string>>(new Set());

  const recordView = useCallback(async (announcementId: string) => {
    // Prevent duplicate views in same session
    if (viewedRef.current.has(announcementId)) return;
    viewedRef.current.add(announcementId);

    try {
      // Call API only - backend handles identity via __vid cookie
      // and broadcasts via WebSocket internally
      await announcementsApi.recordView(announcementId);
    } catch (error) {
      // Silent fail - view tracking is not critical
      console.error('[View] Failed to record view:', error);
    }
  }, []);

  return { recordView };
}

export function useAnnouncementViewer(id: string) {
  return useQuery({
    queryKey: ['announcements', id, 'viewer'],
    queryFn: () => announcementsApi.getViewers(id),
    enabled: !!id,
  })
}
