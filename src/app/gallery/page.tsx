import { Suspense } from 'react';
import { PixelNav } from '@/components/pixel/pixel-nav';
import { GalleryClient } from './_components/gallery-client';
import { AlbumsSection } from './_components/albums-section';
import type { Metadata } from 'next';
import type { GalleryType } from '@/types/gallery.types';

export const metadata: Metadata = {
  title: 'Gallery - PPLG 1',
  description: 'Kumpulan foto, video, dan live photo Kelas PPLG 2025/2026',
};

type SearchParams = Promise<{ type?: string; category?: string }>;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const initialType = (params.type as GalleryType) ?? undefined;
  const initialCategory = params.category;

  return (
    <div className="min-h-screen flex flex-col">
      <PixelNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-10 sm:py-16 px-4 overflow-hidden border-b border-[rgb(var(--border))]">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgb(var(--charcoal)) 1px, transparent 1px),
                linear-gradient(90deg, rgb(var(--charcoal)) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
            }}
          />

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgb(var(--mint))/0.4] text-[10px] font-pixel text-[rgb(var(--charcoal))]">
                📸 Gallery
              </span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-[rgb(var(--charcoal))] mb-3 leading-relaxed">
              Gallery Kelas PPLG 2025/2026
            </h1>
            <p className="text-sm text-[rgb(var(--slate))] max-w-lg leading-relaxed">
              Kumpulan momen foto, video, dan live photo seru dari kegiatan kelas PPLG 1.
            </p>
          </div>
        </section>

        {/* Gallery grid with filters & infinite scroll */}
        <Suspense>
          <GalleryClient
            initialType={initialType}
            initialCategory={initialCategory}
          />
        </Suspense>

        {/* Albums section */}
        <AlbumsSection />
      </main>
    </div>
  );
}
