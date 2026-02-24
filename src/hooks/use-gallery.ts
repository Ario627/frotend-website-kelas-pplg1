'use client';

import type { GalleryQueryParams } from "@/types/gallery.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

export function useGalleryCategories() {
  return useQuery({
    queryKey: ['gallery', 'categories'],
    queryFn: () => galleryApi.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
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
      // Silently fail - view tracking is non-critical
      viewedRef.current.delete(galleryItemId);
    });
  }, [queryClient]);

  return { recordView };
}
