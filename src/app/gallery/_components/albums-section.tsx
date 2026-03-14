'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { useAlbums, useAlbumDetail } from '@/hooks/use-gallery';
import { PixelCard } from '@/components/pixel/pixel-card';
import { Skeleton } from '@/components/shared/loading-skeleton';
import { GalleryLightbox } from './gallery-lightbox';
import { FolderOpen, ImageIcon, X, Play } from 'lucide-react';
import type { Album, GalleryItem } from '@/types/gallery.types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function AlbumCard({
  album,
  onClick,
}: {
  album: Album;
  onClick: () => void;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <PixelCard
        hover={false}
        className="p-0 overflow-hidden group cursor-pointer"
        onClick={onClick}
      >
        <div className="relative aspect-video bg-[rgb(var(--lavender))/0.3] overflow-hidden">
          {album.coverUrl ? (
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FolderOpen size={32} className="text-[rgb(var(--muted))]" />
            </div>
          )}
          {/* Item count badge */}
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-pixel bg-white/90 text-[rgb(var(--charcoal))] border border-[rgb(var(--charcoal))/0.1]">
              <ImageIcon size={8} />
              {album.itemCount}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-pixel text-xs text-[rgb(var(--charcoal))] mb-1 line-clamp-1">
            {album.title}
          </h3>
          {album.description && (
            <p className="text-[10px] text-[rgb(var(--slate))] line-clamp-2 leading-relaxed">
              {album.description}
            </p>
          )}
        </div>
      </PixelCard>
    </motion.div>
  );
}

function AlbumDetailModal({
  albumId,
  onClose,
}: {
  albumId: number | null;
  onClose: () => void;
}) {
  const { data: album, isPending } = useAlbumDetail(albumId);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const items = album?.items ?? [];

  return (
    <>
      <Dialog.Root open={albumId !== null} onOpenChange={(open) => !open && onClose()}>
        <AnimatePresence>
          {albumId !== null && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  className="fixed inset-4 sm:inset-8 z-50 bg-[rgb(var(--cream))] flex flex-col overflow-hidden border-[1.5px] border-[rgb(var(--charcoal))/0.15] shadow-[8px_8px_0_rgb(var(--shadow)/0.3)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--border))] shrink-0">
                    <div>
                      <Dialog.Title asChild>
                        <h2 className="font-pixel text-sm text-[rgb(var(--charcoal))]">
                          {isPending ? 'Memuat...' : album?.title}
                        </h2>
                      </Dialog.Title>
                      {album?.itemCount != null && (
                        <p className="text-[10px] text-[rgb(var(--muted))] mt-0.5">
                          {album.itemCount} item
                        </p>
                      )}
                    </div>
                    <Dialog.Close asChild>
                      <button
                        className="w-8 h-8 bg-[rgb(var(--lavender))/0.4] hover:bg-[rgb(var(--lavender))/0.7] flex items-center justify-center text-[rgb(var(--charcoal))] transition-colors"
                        onClick={onClose}
                      >
                        <X size={16} />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Description */}
                  {album?.description && (
                    <Dialog.Description asChild>
                      <div className="px-4 py-2.5 border-b border-[rgb(var(--border))] text-xs text-[rgb(var(--slate))] shrink-0">
                        {album.description}
                      </div>
                    </Dialog.Description>
                  )}

                  {/* Items grid */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {isPending ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <Skeleton key={i} className="aspect-square" />
                        ))}
                      </div>
                    ) : items.length === 0 ? (
                      <div className="text-center py-10">
                        <ImageIcon className="w-8 h-8 mx-auto mb-3 text-[rgb(var(--muted))]" />
                        <p className="text-xs text-[rgb(var(--slate))]">Album kosong</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {items.map((item) => {
                          const thumb =
                            item.thumbnailUrl ??
                            item.responsive?.thumbnail ??
                            (item.type === 'video'
                              ? `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg`
                              : item.imageUrl);

                          return (
                            <motion.div
                              key={item.id}
                              whileHover={{ y: -1 }}
                              transition={{ duration: 0.15 }}
                            >
                              <PixelCard
                                hover={false}
                                className="p-0 overflow-hidden group cursor-pointer"
                                onClick={() => setLightboxItem(item)}
                              >
                                <div className="relative aspect-square bg-[rgb(var(--lavender))/0.3] overflow-hidden">
                                  {thumb ? (
                                    <Image
                                      src={thumb}
                                      alt={item.title}
                                      fill
                                      sizes="(max-width: 640px) 50vw, 25vw"
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <ImageIcon
                                        size={20}
                                        className="text-[rgb(var(--muted))]"
                                      />
                                    </div>
                                  )}
                                  {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                      <div className="w-7 h-7 bg-white/90 flex items-center justify-center">
                                        <Play
                                          size={12}
                                          className="text-[rgb(var(--charcoal))] ml-0.5"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {item.type === 'live_photo' && (
                                    <div className="absolute bottom-1.5 right-1.5">
                                      <div className="w-5 h-5 bg-white/80 flex items-center justify-center">
                                        <Play
                                          size={9}
                                          className="text-[rgb(var(--charcoal))] ml-0.5"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="p-2">
                                  <p className="font-pixel text-[9px] text-[rgb(var(--charcoal))] line-clamp-1">
                                    {item.title}
                                  </p>
                                </div>
                              </PixelCard>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Lightbox inside album modal (rendered at body level) */}
      <GalleryLightbox
        item={lightboxItem}
        items={items}
        onClose={() => setLightboxItem(null)}
        onNavigate={setLightboxItem}
      />
    </>
  );
}

export function AlbumsSection() {
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const { data: albums, isPending, isError } = useAlbums();

  if (!isPending && !isError && (!albums || albums.length === 0)) {
    return null;
  }

  return (
    <>
      <section className="py-6 sm:py-10 px-3 sm:px-4 border-t border-[rgb(var(--border))]">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-8">
            <div className="p-1.5 sm:p-2 bg-[rgb(var(--peach))/0.3]">
              <FolderOpen size={16} className="text-[rgb(var(--charcoal))]" />
            </div>
            <div>
              <h2 className="font-pixel text-sm sm:text-lg text-[rgb(var(--charcoal))]">
                Our Albums
              </h2>
              {albums && albums.length > 0 && (
                <span className="text-[10px] text-[rgb(var(--muted))]">
                  {albums.length} album
                </span>
              )}
            </div>
          </div>

          {/* Grid */}
          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video" />
              ))}
            </div>
          ) : isError ? (
            <PixelCard hover={false} className="text-center py-8">
              <p className="text-xs text-[rgb(var(--error))]">Gagal memuat album</p>
            </PixelCard>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
            >
              {albums!.map((album) => (
                <motion.div key={album.id} variants={itemVariants}>
                  <AlbumCard
                    album={album}
                    onClick={() => setSelectedAlbumId(album.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <AlbumDetailModal
        albumId={selectedAlbumId}
        onClose={() => setSelectedAlbumId(null)}
      />
    </>
  );
}
