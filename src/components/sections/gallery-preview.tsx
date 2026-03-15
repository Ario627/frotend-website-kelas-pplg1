'use client';

import {motion} from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useGallery } from '@/hooks/use-gallery';
import { PixelCard } from '../pixel/pixel-card';
import { PixelButton } from '../pixel/pixel-button';
import { Skeleton } from '../shared/loading-skeleton';
import { ImageIcon, Play, ArrowRight, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { GalleryItem } from '@/types/gallery.types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

function PreviewCard({ item }: { item: GalleryItem }) {
  const thumbnailSrc =
    item.thumbnailUrl ??
    item.responsive?.thumbnail ??
    (item.type === 'video'
      ? `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg`
      : item.imageUrl);

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <PixelCard hover={false} className="p-0 overflow-hidden group">
        <div className="relative aspect-square bg-[rgb(var(--lavender))/0.3] overflow-hidden">
          {thumbnailSrc ? (
            <Image
              src={thumbnailSrc}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon size={24} className="text-[rgb(var(--muted))]" />
            </div>
          )}

          
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-8 h-8 bg-white/90 flex items-center justify-center shadow-[2px_2px_0_rgb(var(--shadow)/0.3)]">
                <Play size={14} className="text-[rgb(var(--charcoal))] ml-0.5" />
              </div>
            </div>
          )}

          
          {item.type === 'live_photo' && (
            <div className="absolute bottom-2 right-2">
              <div className="w-6 h-6 bg-white/80 flex items-center justify-center shadow-[1px_1px_0_rgb(var(--shadow)/0.2)]">
                <Play size={10} className="text-[rgb(var(--charcoal))] ml-0.5" />
              </div>
            </div>
          )}

          
          <div className="absolute top-2 left-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-pixel border',
                item.type === 'video'
                  ? 'bg-[rgb(var(--peach))] text-[rgb(var(--charcoal))] border-[rgb(var(--charcoal))/0.1]'
                  : item.type === 'live_photo'
                    ? 'bg-[rgb(var(--sky))] text-[rgb(var(--charcoal))] border-[rgb(var(--charcoal))/0.1]'
                    : 'bg-[rgb(var(--mint))] text-[rgb(var(--charcoal))] border-[rgb(var(--charcoal))/0.1]',
              )}
            >
              {item.type === 'video' ? (
                <><Play size={7} />Video</>
              ) : item.type === 'live_photo' ? (
                <><Clapperboard size={7} />Live</>
              ) : (
                <><ImageIcon size={7} />Foto</>
              )}
            </span>
          </div>

          
          {item.category && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex px-1.5 py-0.5 text-[8px] font-pixel bg-white/80 text-[rgb(var(--slate))] border border-[rgb(var(--charcoal))/0.08]">
                {item.category}
              </span>
            </div>
          )}
        </div>

        <div className="p-2.5">
          <h3 className="font-pixel text-[10px] text-[rgb(var(--charcoal))] line-clamp-1">
            {item.title}
          </h3>
        </div>
      </PixelCard>
    </motion.div>
  );
}

export function GalleryPreview() {
  const { data, isPending, isError } = useGallery({ limit: 8 });
  const galleryItems = data?.data ?? [];
  const totalItems = data?.total ?? 0;

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-4">
      <div className="container mx-auto max-w-5xl">
        
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-[rgb(var(--sky))/0.3]">
              <ImageIcon size={16} className="text-[rgb(var(--charcoal))]" />
            </div>
            <div>
              <h2 className="font-pixel text-sm sm:text-lg text-[rgb(var(--charcoal))]">
                Galeri Terbaru
              </h2>
              {totalItems > 0 && (
                <span className="text-[10px] text-[rgb(var(--muted))]">
                  {totalItems} item
                </span>
              )}
            </div>
          </div>

          <Link href="/gallery">
            <PixelButton variant="ghost" size="sm">
              <span className="hidden sm:inline">Lihat Semua</span>
              <ArrowRight size={14} />
            </PixelButton>
          </Link>
        </div>

        
        {isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        ) : isError ? (
          <PixelCard hover={false} className="text-center py-8">
            <p className="text-xs text-[rgb(var(--error))]">Gagal memuat galeri</p>
          </PixelCard>
        ) : galleryItems.length === 0 ? (
          <PixelCard hover={false} className="text-center py-10">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-[rgb(var(--muted))]" />
            <p className="text-xs text-[rgb(var(--slate))] mb-1">Belum ada galeri</p>
            <p className="text-[10px] text-[rgb(var(--muted))]">
              Foto dan video akan muncul di sini
            </p>
          </PixelCard>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
          >
            {galleryItems.slice(0, 8).map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <PreviewCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        
        <motion.div
          className="text-center mt-6 sm:mt-10"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <Link href="/gallery">
            <PixelButton variant="mint" size="lg" className="w-full sm:w-auto">
              <ImageIcon size={16} />
              Lihat Semua Gallery
              <ArrowRight size={14} />
            </PixelButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}