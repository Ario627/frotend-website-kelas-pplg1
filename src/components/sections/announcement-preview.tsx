'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { PixelCard } from "../pixel/pixel-card"
import { PixelButton } from "../pixel/pixel-button"
import { Megaphone, ArrowRight, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Skeleton } from "../shared/loading-skeleton"
import { formatRelativeTime } from "@/lib/utils/format-date"
import { useAnnouncements } from "@/hooks/use-announcement"

const priorityConfig = {
  urgent: { icon: AlertCircle, bg: 'bg-[rgb(var(--error))/0.25]' },
  high: { icon: AlertCircle, bg: 'bg-[rgb(var(--error))/0.15]' },
  medium: { icon: AlertTriangle, bg: 'bg-[rgb(var(--warning))/0.15]' },
  low: { icon: Info, bg: 'bg-[rgb(var(--info))/0.15]' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { straggerChildren: 0.1 }
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export function AnnouncementPreview() {
  const { data, isPending } = useAnnouncements(1, 3);

  return (
    <section className="py-10 px-4 relative">
      
      {/*Background Decoration*/}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgb(var(--charcoal)) 1px, transparent 1px),
              linear-gradient(90deg, rgb(var(--charcoal)) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-rgb(var(--cream))" />
      </div>
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
          <Link href="/announcements">
            <PixelButton variant="ghost" size="sm">
              Lihat Semua
              <ArrowRight size={14} />
            </PixelButton>
          </Link>
        </div>

        {/* Content */}
        {isPending ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : !data?.data?.length ? (
          <PixelCard hover={false} className="text-center py-12">
            <Megaphone className="w-10 h-10 mx-auto mb-3 text-[rgb(var(--muted))]" />
            <p className="text-sm text-[rgb(var(--slate))]">
              Belum ada pengumuman
            </p>
          </PixelCard>
        ) : (
          <motion.div
            className="grid md:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {data.data.map((announcement) => {
              const priority = priorityConfig[announcement.priority];
              const PriorityIcon = priority.icon;

              return (
                <motion.div key={announcement.id} variants={itemVariants}>
                  <PixelCard className="p-5 h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-1.5 ${priority.bg}`}>
                        <PriorityIcon size={12} className="text-[rgb(var(--charcoal))]" />
                      </div>
                      <span className="text-[10px] text-[rgb(var(--muted))]">
                        {formatRelativeTime(announcement.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-pixel text-xs text-[rgb(var(--charcoal))] mb-2 line-clamp-2">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-[rgb(var(--slate))] line-clamp-3">
                      {announcement.content}
                    </p>
                  </PixelCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}