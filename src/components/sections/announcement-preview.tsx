'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useAnnouncements } from '@/hooks/use-announcement';
import { AnnouncementCard } from '../annnouncements/announcement-card';
import { CreateAnnouncementDialog } from '../annnouncements/create-announcement-dialog';
import { PixelButton } from '@/components/pixel/pixel-button';
import { PixelCard } from '@/components/pixel/pixel-card';
import { Skeleton } from '@/components/shared/loading-skeleton';
import { Megaphone, ArrowRight, Plus } from 'lucide-react';

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
    transition: { duration: 0.35, ease: 'easeOut' as const }
  },
};

export function AnnouncementPreview() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { isAdmin, isAuthenticated } = useAuth();
  const { data: announcements, isPending, isError } = useAnnouncements();

  const sortedAnnouncements = useMemo(() => {
    if (!announcements) return [];
    return [...announcements].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [announcements]);

  return (
    <>
      <section className="py-6 sm:py-10 px-3 sm:px-4">
        <div className="container mx-auto max-w-5xl">
          
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-[rgb(var(--peach))/0.3]">
                <Megaphone size={16} className="sm:w-4.5 sm:h-4.5 text-[rgb(var(--charcoal))]" />
              </div>
              <h2 className="font-pixel text-sm sm:text-lg text-[rgb(var(--charcoal))]">
                Pengumuman
              </h2>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {isAuthenticated && isAdmin && (
                <PixelButton
                  variant="mint"
                  size="sm"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Buat</span>
                </PixelButton>
              )}

              <Link href="/announcements">
                <PixelButton variant="ghost" size="sm">
                  <span className="hidden sm:inline">Lihat Semua</span>
                  <ArrowRight size={14} />
                </PixelButton>
              </Link>
            </div>
          </div>

          
          {isPending ? (
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36 sm:h-44" />
              ))}
            </div>
          ) : isError ? (
            <PixelCard hover={false} className="text-center py-8 sm:py-12">
              <p className="text-xs sm:text-sm text-[rgb(var(--error))]">
                Gagal memuat pengumuman
              </p>
            </PixelCard>
          ) : sortedAnnouncements.length === 0 ? (
            <PixelCard hover={false} className="text-center py-8 sm:py-12">
              <Megaphone className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-[rgb(var(--muted))]" />
              <p className="text-xs sm:text-sm text-[rgb(var(--slate))] mb-4">
                Belum ada pengumuman
              </p>
              {isAdmin && (
                <PixelButton
                  variant="mint"
                  size="sm"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus size={14} />
                  Buat Pengumuman Pertama
                </PixelButton>
              )}
            </PixelCard>
          ) : (
            <motion.div
              className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
            >
              {sortedAnnouncements.slice(0, 6).map((announcement) => (
                <motion.div key={announcement.id} variants={itemVariants}>
                  <AnnouncementCard
                    announcement={announcement}
                    showAdminActions={isAdmin}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {isAdmin && (
        <CreateAnnouncementDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      )}
    </>
  );
}

