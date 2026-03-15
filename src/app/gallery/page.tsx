import { Suspense } from "react";
import { PixelNav } from "@/components/pixel/pixel-nav";
import { GalleryClient } from "./_components/gallery-client";
import { AlbumsSection } from "./_components/album-section";
import type { Metadata } from "next";
import type { GalleryType } from "@/types/gallery.types";

export const metadata: Metadata = {
    title: 'Gallery - Kelas X PPLG 1',
    description: 'Kumpulan foto dan video kegiatan kelas X PPLG 1',
}

type SearchParams = Promise<{type?: string; category?: string}>;

// 1. Kita bikin komponen baru (Wrapper) khusus buat nge-handle await searchParams
async function GalleryWrapper({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const initialType = (params.type as GalleryType) ?? undefined;
  const initialCategory = params.category;

  return (
    <GalleryClient
      initialType={initialType}
      initialCategory={initialCategory}
    />
  );
}

// 2. Komponen Page utama lu sekarang bersih, ga ada 'await' di level atas
export default function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PixelNav />
      <main className="flex-1">
        <section className="relative py-10 sm:py-16 px-4 overflow-hidden border-b border-[rgb(var(--border))]">
          
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
                 Gallery
              </span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-[rgb(var(--charcoal))] mb-3 leading-relaxed">
              Gallery Kelas PPLG 2025/2026
            </h1>
            <p className="text-sm text-[rgb(var(--slate))] max-w-lg leading-relaxed">
              Apa Aja
            </p>
          </div>
        </section>

        
        <Suspense fallback={<div className="py-10 text-center font-pixel text-[rgb(var(--charcoal))]">Loading gallery...</div>}>
          <GalleryWrapper searchParams={searchParams} />
        </Suspense>

        
        <AlbumsSection />
      </main>
    </div>
  );
}