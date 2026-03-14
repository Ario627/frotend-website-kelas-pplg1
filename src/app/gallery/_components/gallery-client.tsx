'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useInfiniteGallery, useGalleryCategories } from '@/hooks/use-gallery';
import { PixelCard } from '@/components/pixel/pixel-card';
import { PixelButton } from '@/components/pixel/pixel-button';
import { Skeleton } from '@/components/shared/loading-skeleton';
import { GalleryLightbox } from './gallery-lightbox';
import {
  ImageIcon,
  Play,
  Film,
  Filter,
  Clapperboard,
  X,
  ArrowDown,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { GalleryItem, GalleryType } from '@/types/gallery.types';

type FilterType = 'all' | GalleryType;

const typeFilters: {
  key: FilterType;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { key: 'all', label: 'Semua', icon: Filter },
  { key: 'image', label: 'Foto', icon: ImageIcon },
  { key: 'video', label: 'Video', icon: Film },
  { key: 'live_photo', label: 'Live Photo', icon: Clapperboard },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function GalleryGridCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  const thumbnailSrc =
    item.thumbnailUrl ??
    item.responsive?.thumbnail ??
    (item.type === 'video'
      ? `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg`
      : item.imageUrl);

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} layout>
      <PixelCard
        hover={false}
        className="p-0 overflow-hidden group cursor-pointer"
        onClick={onClick}
      >
        <div className="relative aspect-square bg-[rgb(var(--lavender))/0.3] overflow-hidden">
          {thumbnailSrc ? (
            <Image
              src={thumbnailSrc}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
              {item.type === 'video'
                ? 'Video'
                : item.type === 'live_photo'
                  ? 'Live'
                  : 'Foto'}
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

interface GalleryClientProps {
  initialType?: GalleryType;
  initialCategory?: string;
}

export function GalleryClient({ initialType, initialCategory }: GalleryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeType, setActiveType] = useState<FilterType>(initialType ?? 'all');
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    initialCategory,
  );
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const { data: categories } = useGalleryCategories();

  const queryParams = {
    type: activeType !== 'all' ? (activeType as GalleryType) : undefined,
    category: activeCategory,
    limit: 12,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteGallery(queryParams);

  const allItems = data?.pages.flatMap((page) => page.data) ?? [];

  const updateUrl = useCallback(
    (type: FilterType, category?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (type !== 'all') {
        params.set('type', type);
      } else {
        params.delete('type');
      }
      if (category) {
        params.set('category', category);
      } else {
        params.delete('category');
      }
      router.replace(`/gallery?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleTypeFilter = (type: FilterType) => {
    setActiveType(type);
    updateUrl(type, activeCategory);
  };

  const handleCategoryFilter = (category: string) => {
    const next = category === activeCategory ? undefined : category;
    setActiveCategory(next);
    updateUrl(activeType, next);
  };

  const handleClearCategory = () => {
    setActiveCategory(undefined);
    updateUrl(activeType, undefined);
  };

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Filter bar */}
        <div className="flex flex-col gap-3 mb-6">
          {/* Type filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {typeFilters.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTypeFilter(key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] font-pixel transition-all duration-150 border-[1.5px]',
                  activeType === key
                    ? 'bg-[rgb(var(--mint))] text-[rgb(var(--charcoal))] border-[rgb(var(--charcoal))/0.1] shadow-[2px_2px_0_rgb(var(--shadow)/0.2)]'
                    : 'bg-white text-[rgb(var(--slate))] border-[rgb(var(--charcoal))/0.08] hover:bg-[rgb(var(--lavender))/0.4] hover:text-[rgb(var(--charcoal))]',
                )}
              >
                <Icon size={10} />
                {label}
              </button>
            ))}
          </div>

          {/* Category filters */}
          {categories && categories.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-[rgb(var(--muted))] font-pixel">
                Kategori:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => handleCategoryFilter(cat.category)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-pixel transition-all duration-150 border',
                    activeCategory === cat.category
                      ? 'bg-[rgb(var(--sky))] text-[rgb(var(--charcoal))] border-[rgb(var(--charcoal))/0.1] shadow-[2px_2px_0_rgb(var(--shadow)/0.15)]'
                      : 'bg-[rgb(var(--lavender))/0.3] text-[rgb(var(--muted))] border-transparent hover:border-[rgb(var(--border))] hover:text-[rgb(var(--charcoal))]',
                  )}
                >
                  {cat.category}
                  <span className="text-[8px] opacity-60">({cat.count})</span>
                </button>
              ))}
              {activeCategory && (
                <button
                  onClick={handleClearCategory}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-pixel text-[rgb(var(--error))/0.8] hover:text-[rgb(var(--error))] transition-colors"
                >
                  <X size={9} />
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        {/* Gallery grid */}
        {isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        ) : isError ? (
          <PixelCard hover={false} className="text-center py-10">
            <p className="text-xs text-[rgb(var(--error))]">
              Gagal memuat galeri. Coba lagi nanti.
            </p>
          </PixelCard>
        ) : allItems.length === 0 ? (
          <PixelCard hover={false} className="text-center py-14">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-[rgb(var(--muted))]" />
            <p className="text-sm text-[rgb(var(--slate))] mb-1 font-pixel">
              Belum ada item
            </p>
            <p className="text-[10px] text-[rgb(var(--muted))]">
              Coba ubah filter atau kategori
            </p>
          </PixelCard>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeType}-${activeCategory}`}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {allItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <GalleryGridCard
                    item={item}
                    onClick={() => setLightboxItem(item)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4 mt-4" />

        {/* Loading more skeletons */}
        {isFetchingNextPage && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        )}

        {/* No more items */}
        {!hasNextPage && allItems.length > 0 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[rgb(var(--lavender))/0.3] text-[10px] font-pixel text-[rgb(var(--muted))] border border-[rgb(var(--border))]">
              ✦ Semua {allItems.length} item sudah ditampilkan ✦
            </span>
          </motion.div>
        )}

        {/* Manual load more fallback */}
        {hasNextPage && !isFetchingNextPage && (
          <div className="text-center mt-6">
            <PixelButton variant="outline" size="md" onClick={() => fetchNextPage()}>
              <ArrowDown size={14} />
              Muat Lebih Banyak
            </PixelButton>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        item={lightboxItem}
        items={allItems}
        onClose={() => setLightboxItem(null)}
        onNavigate={setLightboxItem}
      />
    </section>
  );
}
