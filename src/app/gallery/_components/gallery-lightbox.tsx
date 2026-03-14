'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
} from 'lucide-react';
import { PixelButton } from '@/components/pixel/pixel-button';
import type { GalleryItem } from '@/types/gallery.types';

interface GalleryLightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (item: GalleryItem) => void;
}

export function GalleryLightbox({
  item,
  items,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const [zoom, setZoom] = useState(1);

  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setZoom(1);
      onNavigate(items[currentIndex - 1]);
    }
  }, [hasPrev, items, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setZoom(1);
      onNavigate(items[currentIndex + 1]);
    }
  }, [hasNext, items, currentIndex, onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [item, handlePrev, handleNext, onClose]);

  useEffect(() => {
    setZoom(1);
  }, [item?.id]);

  const imageSrc = item?.responsive?.full ?? item?.imageUrl ?? item?.thumbnailUrl;

  return (
    <Dialog.Root open={!!item} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {item && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative w-full max-w-4xl flex flex-col max-h-[90vh]">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <div className="flex-1 min-w-0">
                      <Dialog.Title asChild>
                        <h3 className="font-pixel text-sm text-white line-clamp-1">
                          {item.title}
                        </h3>
                      </Dialog.Title>
                      {item.description && (
                        <Dialog.Description asChild>
                          <p className="text-xs text-white/60 mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        </Dialog.Description>
                      )}
                    </div>
                    <Dialog.Close asChild>
                      <button
                        className="shrink-0 w-8 h-8 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        onClick={onClose}
                      >
                        <X size={16} />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Media */}
                  <div className="relative overflow-hidden bg-black/40 flex items-center justify-center min-h-[280px] flex-1">
                    {item.type === 'video' && item.youtubeVideoId && /^[a-zA-Z0-9_-]{11}$/.test(item.youtubeVideoId) ? (
                      <div className="w-full aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${item.youtubeVideoId}?autoplay=1&rel=0`}
                          title={item.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : item.type === 'live_photo' ? (
                      <div className="relative w-full h-full flex items-center justify-center min-h-[280px]">
                        {/* Still image base */}
                        {imageSrc && (
                          <Image
                            src={imageSrc}
                            alt={item.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 80vw"
                          />
                        )}
                        {/* Autoplay loop mp4 */}
                        {item.liveVideoMp4Url && (
                          <video
                            src={item.liveVideoMp4Url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        )}
                        {/* Duration badge */}
                        {item.liveVideoDuration && (
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 px-2 py-1 text-white text-[10px] font-pixel">
                            <Clock size={10} />
                            {item.liveVideoDuration.toFixed(1)}s
                          </div>
                        )}
                        {/* Live badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-[rgb(var(--sky))/0.9] px-2 py-1 text-[rgb(var(--charcoal))] text-[9px] font-pixel border border-[rgb(var(--charcoal))/0.1]">
                          <Play size={8} />
                          Live Photo
                        </div>
                      </div>
                    ) : (
                      /* Image with zoom */
                      <div
                        className="relative flex items-center justify-center overflow-hidden w-full h-full cursor-zoom-in min-h-[280px]"
                        onClick={() => setZoom((z) => Math.min(z + 0.5, 3))}
                      >
                        {imageSrc && (
                          <motion.div
                            animate={{ scale: zoom }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                          >
                            <Image
                              src={imageSrc}
                              alt={item.title}
                              width={1920}
                              height={1080}
                              className="object-contain max-h-[60vh] w-auto"
                              sizes="(max-width: 1024px) 100vw, 80vw"
                            />
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between mt-3 gap-2">
                    <div className="flex items-center gap-2">
                      {item.type === 'image' && (
                        <>
                          <PixelButton
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
                            disabled={zoom <= 1}
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            <ZoomOut size={14} />
                          </PixelButton>
                          <PixelButton
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom((z) => Math.min(z + 0.5, 3))}
                            disabled={zoom >= 3}
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            <ZoomIn size={14} />
                          </PixelButton>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <PixelButton
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={!hasPrev}
                        className="text-white border-white/20 hover:bg-white/10"
                      >
                        <ChevronLeft size={14} />
                      </PixelButton>
                      <span className="text-white/60 text-[10px] font-pixel">
                        {currentIndex + 1} / {items.length}
                      </span>
                      <PixelButton
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={!hasNext}
                        className="text-white border-white/20 hover:bg-white/10"
                      >
                        <ChevronRight size={14} />
                      </PixelButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
