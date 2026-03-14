'use client';

import { memo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import * as Tooltip from '@radix-ui/react-tooltip';
import { PixelCard } from '../pixel/pixel-card';
import { useGalleryRecordView } from '@/hooks/use-gallery';
import { Eye, Play, ImageIcon, Calendar, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { GalleryItem } from '@/types/gallery.types';

interface GalleryCardProps {
  item: GalleryItem;
}

export const GalleryCard = memo(function GalleryCard({ item }: GalleryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { recordView } = useGalleryRecordView();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          recordView(item.id);
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: '0px' },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [item.id, recordView]);

  const thumbnailSrc =
    item.type === 'video'
      ? item.thumbnailUrl ?? `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg`
      : item.thumbnailUrl ?? item.responsive?.thumbnail ?? item.imageUrl;

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(item.createdAt));

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      layout
    >
      <PixelCard hover={false} className="p-0 overflow-hidden group">
        {/* Thumbnail */}
        <div className="relative aspect-4/3 bg-[rgb(var(--lavender))/0.3] overflow-hidden">
          {thumbnailSrc ? (
            <Image
              src={thumbnailSrc}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon size={32} className="text-[rgb(var(--muted))]" />
            </div>
          )}

          {/* Video Play Overlay */}
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-10 h-10 bg-white/90 flex items-center justify-center shadow-[2px_2px_0_rgb(var(--shadow)/0.3)]">
                <Play size={18} className="text-[rgb(var(--charcoal))] ml-0.5" />
              </div>
            </div>
          )}

          {/* Live Photo overlay */}
          {item.type === 'live_photo' && (
            <div className="absolute bottom-2 right-2">
              <div className="w-7 h-7 bg-white/85 flex items-center justify-center shadow-[1px_1px_0_rgb(var(--shadow)/0.25)]">
                <Play size={11} className="text-[rgb(var(--charcoal))] ml-0.5" />
              </div>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-pixel border',
                item.type === 'video'
                  ? 'bg-[rgb(var(--peach))] text-[rgb(var(--charcoal))] border-[rgb(var(--charcoal))/0.1]'
                  : item.type === 'live_photo'
                    ? 'bg-[rgb(var(--sky))] text-[rgb(var(--charcoal))] border-[rgb(var(--charcoal))/0.1]'
                    : 'bg-[rgb(var(--mint))] text-[rgb(var(--charcoal))] border-[rgb(var(--charcoal))/0.1]',
              )}
            >
              {item.type === 'video' ? (
                <><Play size={8} /> Video</>
              ) : item.type === 'live_photo' ? (
                <><Clapperboard size={8} /> Live</>
              ) : (
                <><ImageIcon size={8} /> Foto</>
              )}
            </span>
          </div>

          {/* Category Badge */}
          {item.category && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex px-2 py-0.5 text-[9px] font-pixel bg-white/80 text-[rgb(var(--slate))] border border-[rgb(var(--charcoal))/0.08]">
                {item.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-pixel text-xs text-[rgb(var(--charcoal))] mb-1.5 line-clamp-1">
            {item.title}
          </h3>

          {item.description && (
            <p className="text-[11px] text-[rgb(var(--slate))] line-clamp-2 mb-3 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Footer — Views & Date */}
          <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--border))]">
            <Tooltip.Provider delayDuration={300}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="flex items-center gap-1.5 text-[rgb(var(--muted))] cursor-default shrink-0">
                    <Eye size={12} />
                    <span className="text-[10px]">{item.viewCount}</span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    sideOffset={5}
                    className="bg-[rgb(var(--charcoal))] text-white text-[10px] px-2 py-1 rounded-none z-50"
                  >
                    {item.viewCount} kali dilihat
                    <Tooltip.Arrow className="fill-[rgb(var(--charcoal))]" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            <div className="flex items-center gap-1 text-[rgb(var(--muted))]">
              <Calendar size={10} />
              <span className="text-[10px]">{formattedDate}</span>
            </div>
          </div>
        </div>
      </PixelCard>
    </motion.div>
  );
});
