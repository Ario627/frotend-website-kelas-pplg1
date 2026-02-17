'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { announcementsApi } from "@/lib/api/announcements"
import type { CreateAnnouncementDto, UpdateAnnouncementDto } from "@/types/api.types"
import { toast } from "./use-toast"

export function useAnnouncements() {
    return useQuery({
        queryKey: ['announcements', 'active'],
        queryFn: () => announcementsApi.getActive(),
        refetchInterval: 20000, // Update setiap 20 detik
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export function useAllAnnouncements() {
    return useQuery({
        queryKey: ['announcements', 'all'],
        queryFn: () => announcementsApi.getAll(),
    });
}

export function useCreateAnnouncement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAnnouncementDto) => announcementsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            toast({ title: 'Pengumuman berhasil dibuat.' });
        },
        onError: () => {
            toast({ title: 'Error', description: 'Gagal membuat pengumuman.', variant: 'destructive' });
        },
    });
}

export function useUpdateAnnouncement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateAnnouncementDto }) => announcementsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            toast({ title: 'Pengumuman berhasil diperbarui.' });
        },
        onError: () => {
            toast({ title: 'Error', description: 'Gagal memperbarui pengumuman.', variant: 'destructive' });
        },
    });
}

export function useDeleteAnnouncement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => announcementsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            toast({ title: 'Pengumuman berhasil dihapus.' });
        },
        onError: () => {
            toast({ title: 'Error', description: 'Gagal menghapus pengumuman.', variant: 'destructive' });
        },
    });
}