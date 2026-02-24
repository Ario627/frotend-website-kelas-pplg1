'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useGallery, useGalleryCategories } from '@/hooks/use-gallery';
import { GalleryCard } from '../gallery/gallery-card';
import { PixelCard } from '../pixel/pixel-card';
import { PixelButton } from '../pixel/pixel-button';
import { Skeleton } from '../shared/loading-skeleton';
import { ImageIcon, ArrowRight, Film, Filter } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { GalleryType } from '@/types/gallery.types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

type FilterType = 'all' | GalleryType;

export function GalleryPreview() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: 6,
      type: activeFilter !== 'all' ? (activeFilter as GalleryType) : undefined,
    }),
    [activeFilter],
  );

  const { data, isPending, isError } = useGallery(queryParams);
  const { data: categories } = useGalleryCategories();

  const galleryItems = data?.data ?? [];
  const totalItems = data?.total ?? 0;

  const filters: { key: FilterType; label: string; icon: typeof ImageIcon }[] = [
    { key: 'all', label: 'Semua', icon: Filter },
    { key: 'image', label: 'Foto', icon: ImageIcon },
    { key: 'video', label: 'Video', icon: Film },
  ] as const;

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-[rgb(var(--mint))/0.3]">
              <ImageIcon size={16} className="sm:w-4.5 sm:h-4.5 text-[rgb(var(--charcoal))]" />
            </div>
            <div>
              <h2 className="font-pixel text-sm sm:text-lg text-[rgb(var(--charcoal))]">
                Galeri
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 mb-5 sm:mb-6 flex-wrap">
          {filters.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] font-pixel transition-all duration-150',
                'border-[1.5px]',
                activeFilter === key
                  ? 'bg-[rgb(var(--mint))] text-[rgb(var(--charcoal))] border-[rgb(var(--charcoal))/0.1] shadow-[2px_2px_0_rgb(var(--shadow)/0.2)]'
                  : 'bg-white text-[rgb(var(--slate))] border-[rgb(var(--charcoal))/0.08] hover:bg-[rgb(var(--lavender))/0.4] hover:text-[rgb(var(--charcoal))]',
              )}
            >
              <Icon size={10} />
              {label}
            </button>
          ))}

          {/* Category Badges */}
          {categories && categories.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 ml-2 pl-2 border-l border-[rgb(var(--border))]">
              {categories.slice(0, 3).map((cat) => (
                <span
                  key={cat.category}
                  className="px-2 py-0.5 text-[9px] text-[rgb(var(--muted))] bg-[rgb(var(--lavender))/0.3] border border-transparent"
                >
                  {cat.category} ({cat.count})
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {isPending ? (
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-4/3" />
            ))}
          </div>
        ) : isError ? (
          <PixelCard hover={false} className="text-center py-8 sm:py-12">
            <p className="text-xs sm:text-sm text-[rgb(var(--error))]">
              Gagal memuat galeri
            </p>
          </PixelCard>
        ) : galleryItems.length === 0 ? (
          <PixelCard hover={false} className="text-center py-8 sm:py-12">
            <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-[rgb(var(--muted))]" />
            <p className="text-xs sm:text-sm text-[rgb(var(--slate))] mb-1">
              Belum ada galeri
            </p>
            <p className="text-[10px] sm:text-[11px] text-[rgb(var(--muted))]">
              Foto dan video akan muncul di sini
            </p>
          </PixelCard>
        ) : (
          <motion.div
            key={activeFilter}
            className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {galleryItems.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <GalleryCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* See More CTA */}
        {totalItems > 6 && (
          <motion.div
            className="text-center mt-6 sm:mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/gallery">
              <PixelButton variant="default" size="md">
                Lihat {totalItems - 6} lainnya
                <ArrowRight size={14} />
              </PixelButton>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
