'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';;
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
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
};

export function AnnouncementPreview() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { isAdmin, isAuthenticated } = useAuth();
  const { data: announcements, isPending, isError } = useAnnouncements();

  // Sort: pinned first, then by date
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
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[rgb(var(--peach))/0.3]">
                <Megaphone size={18} className="text-[rgb(var(--charcoal))]" />
              </div>
              <h2 className="font-pixel text-lg text-[rgb(var(--charcoal))]">
                Pengumuman
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Admin Create Button - Only visible for authenticated admin */}
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

          {/* Content */}
          {isPending ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-44" />
              ))}
            </div>
          ) : isError ? (
            <PixelCard hover={false} className="text-center py-12">
              <p className="text-sm text-[rgb(var(--error))]">
                Gagal memuat pengumuman
              </p>
            </PixelCard>
          ) : sortedAnnouncements.length === 0 ? (
            <PixelCard hover={false} className="text-center py-12">
              <Megaphone className="w-10 h-10 mx-auto mb-3 text-[rgb(var(--muted))]" />
              <p className="text-sm text-[rgb(var(--slate))] mb-4">
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
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
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

      {/* Create Dialog - Only rendered for admin */}
      {isAdmin && (
        <CreateAnnouncementDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      )}
    </>
  );
}
