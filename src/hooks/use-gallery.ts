'use client';

import type { GalleryQueryParams, GalleryType } from "@/types/gallery.types";
import { useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { galleryApi } from "@/lib/api/gallery";

export function useGallery(params?: GalleryQueryParams) {
  return useQuery({
    queryKey: [
      'gallery',
      'published',
      params?.type ?? 'all',
      params?.page ?? 1,
      params?.limit ?? 6
    ],
    queryFn: () => galleryApi.getAll(params),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useInfiniteGallery(params?: Omit<GalleryQueryParams, 'cursor' | 'page'>) {
  return useInfiniteQuery({
    queryKey: [
      'gallery',
      'infinite',
      params?.type ?? 'all',
      params?.category ?? 'all',
      params?.limit ?? 12,
    ],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      galleryApi.getAllCursor({ ...params, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasMore ? (lastPage.meta.nextCursor ?? undefined) : undefined,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useGalleryCategories() {
  return useQuery({
    queryKey: ['gallery', 'categories'],
    queryFn: () => galleryApi.getCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAlbums() {
  return useQuery({
    queryKey: ['gallery', 'albums'],
    queryFn: () => galleryApi.getAlbums(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAlbumDetail(id: number | null) {
  return useQuery({
    queryKey: ['gallery', 'album', id],
    queryFn: () => galleryApi.getAlbumById(id!),
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGalleryRecordView() {
  const viewedRef = useRef<Set<number>>(new Set());
  const queryClient = useQueryClient();

  const recordView = useCallback((galleryItemId: number) => {
    if (viewedRef.current.has(galleryItemId)) return;
    viewedRef.current.add(galleryItemId);

    galleryApi.recordView(galleryItemId).then((result) => {
      if (result.isNewView) {
        queryClient.invalidateQueries({ queryKey: ['gallery', 'published'] });
      }
    }).catch(() => {
      viewedRef.current.delete(galleryItemId);
    });
  }, [queryClient]);

  return { recordView };
}