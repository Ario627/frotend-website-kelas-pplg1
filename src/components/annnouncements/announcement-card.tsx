'use client';

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from 'motion/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useAuth } from "@/hooks/use-auth";
import { useAddReaction, useRemoveReaction, usePinAnnouncement, useRecordView } from "@/hooks/use-announcement";
import { PixelCard } from "../pixel/pixel-card";
import { ReactionBar } from "./reaction-bar";
import { formatRelativeTime } from "@/lib/utils/format-date";
import {
  MoreHorizontal,
  Pin,
  PinOff,
  Eye,
  AlertCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  ReactionType,
  type AnnouncementWithStats,
} from '@/types/announcements.types';

const priorityConfig = {
  high: { icon: AlertCircle, bg: 'bg-[rgb(var(--error))/0.15]' },
  medium: { icon: AlertTriangle, bg: 'bg-[rgb(var(--warning))/0.15]' },
  low: { icon: Info, bg: 'bg-[rgb(var(--info))/0.15]' },
  urgent: { icon: AlertCircle, bg: 'bg-[rgb(var(--error))/0.25]' },
};

interface AnnouncementCardProps {
  announcement: AnnouncementWithStats;
  showAdminActions?: boolean;
}

export const AnnouncementCard = memo(function AnnouncementCard({
  announcement,
  showAdminActions = false
}: AnnouncementCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { isAdmin } = useAuth();
  const addReactionMutation = useAddReaction();
  const removeReactionMutation = useRemoveReaction();
  const pinMutation = usePinAnnouncement();
  const { recordView } = useRecordView();

  const priority = priorityConfig[announcement.priority];
  const PriorityIcon = priority.icon;
  const canShowAdminMenu = showAdminActions && isAdmin;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          recordView(announcement.id);
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: '0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [announcement.id, recordView]);

  const handleReact = (announcementId: string, reactionType: ReactionType) => {
    addReactionMutation.mutate({ announcementId, reactionType });
  };

  const handleRemoveReaction = (announcementId: string) => {
    removeReactionMutation.mutate(announcementId);
  };

  const handleTogglePin = () => {
    pinMutation.mutate(announcement.id);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      layout
    >
      <PixelCard
        hover={false}
        className={`p-3.5 sm:p-5 relative transition-all ${announcement.isPinned
          ? 'border-l-4 border-l-[rgb(var(--mint))]'
          : ''
          }`}
      >
        
        {announcement.isPinned && (
          <div className="absolute -top-1.5 -right-1.5 bg-[rgb(var(--mint))] p-1 shadow-sm">
            <Pin size={10} className="text-[rgb(var(--charcoal))]" />
          </div>
        )}

        
        <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className={`p-1 sm:p-1.5 shrink-0 ${priority.bg}`}>
              <PriorityIcon size={11} className="sm:w-3 sm:h-3 text-[rgb(var(--charcoal))]" />
            </div>
            <span className="text-[10px] text-[rgb(var(--muted))] truncate">
              {formatRelativeTime(announcement.createdAt)}
            </span>
          </div>

          
          <AnimatePresence>
            {canShowAdminMenu &&  (
              <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.12 }}
                  className="shrink-0"
                >
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="p-1 sm:p-1.5 hover:bg-[rgb(var(--lavender))] transition-colors"
                      aria-label="Menu"
                    >
                      <MoreHorizontal size={14} className="sm:w-4 sm:h-4 text-[rgb(var(--slate))]" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={5}
                      className="min-w-35 bg-white border border-[rgb(var(--border))] shadow-[3px_3px_0_rgb(var(--shadow)/0.2)] p-1 z-50 animate-in fade-in-50 zoom-in-95"
                    >
                      <DropdownMenu.Item
                        onClick={handleTogglePin}
                        disabled={pinMutation.isPending}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-[rgb(var(--charcoal))] hover:bg-[rgb(var(--lavender))] cursor-pointer outline-none disabled:opacity-50"
                      >
                        {announcement.isPinned ? (
                          <>
                            <PinOff size={14} />
                            Hapus Pin
                          </>
                        ) : (
                          <>
                            <Pin size={14} />
                            Pin Pengumuman
                          </>
                        )}
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        
        <h3 className="font-pixel text-[11px] sm:text-xs text-[rgb(var(--charcoal))] mb-1.5 sm:mb-2 line-clamp-2">
          {announcement.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-[rgb(var(--slate))] line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 leading-relaxed">
          {announcement.content}
        </p>

        
        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-[rgb(var(--border))] gap-2">
          
          <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className="flex items-center gap-1 text-[rgb(var(--muted))] cursor-default shrink-0">
                  <Eye size={11} className="sm:w-3 sm:h-3" />
                  <span className="text-[10px]">{announcement.viewCount || 0}</span>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={5}
                  className="bg-[rgb(var(--charcoal))] text-white text-[10px] px-2 py-1 rounded-none z-50"
                >
                  {announcement.viewCount || 0} orang melihat
                  <Tooltip.Arrow className="fill-[rgb(var(--charcoal))]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          
          <ReactionBar
            announcementId={announcement.id}
            reactions={announcement.reactions || []}
            userReaction={announcement.userReaction}
            onReact={handleReact}
            onRemoveReaction={handleRemoveReaction}
            disabled={addReactionMutation.isPending || removeReactionMutation.isPending}
          />
        </div>
      </PixelCard>
    </motion.div>
  );
});
