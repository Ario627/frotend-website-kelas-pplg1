'use client';

import { Suspense, useOptimistic, useTransition } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { PixelCard } from '@/components/pixel/pixel-card';
import { PixelButton } from '@/components/pixel/pixel-button';
import { useAnnouncements } from '@/hooks/use-announcement';
import { usePendingUsers, useApproveUser, useRejectUser } from '@/hooks/use-users';
import { useAuth } from '@/hooks/use-auth';
import { formatRelativeTime } from '@/lib/utils/format-date';
import { Skeleton } from '@/components/shared/loading-skeleton';
import {
  Megaphone,
  Image,
  Users,
  Rocket,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
  Activity,
  TrendingUp,
  Calendar
} from 'lucide-react';
import type { PendingUser } from '@/types/user.types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
};

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  trend
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  href: string;
  trend?: string;
}) {
  return (
    <Link href={href}>
      <PixelCard className="p-5 group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-[rgb(var(--slate))] mb-1">{label}</p>
            <p className="font-pixel text-2xl text-[rgb(var(--charcoal))]">
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={10} className="text-[rgb(var(--mint))]" />
                <span className="text-[10px] text-[rgb(var(--slate))]">{trend}</span>
              </div>
            )}
          </div>
          <div className="p-2 bg-[rgb(var(--lavender))/0.5] group-hover:bg-[rgb(var(--mint))/0.3] transition-colors">
            <Icon size={18} className="text-[rgb(var(--slate))]" />
          </div>
        </div>
      </PixelCard>
    </Link>
  );
}

function PendingUserCard({
  user,
  onApprove,
  onReject,
  isApproving,
  isRejecting
}: {
  user: PendingUser;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center justify-between p-3 bg-[rgb(var(--stone))] border border-[rgb(var(--border))]"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[rgb(var(--lavender))] flex items-center justify-center text-sm font-pixel text-[rgb(var(--charcoal))]">
          {(user.name || '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-[rgb(var(--charcoal))]">
            {user.name || 'Unknown User'}
          </p>
          <p className="text-xs text-[rgb(var(--slate))]">
            {user.email}
          </p>
        </div>
      </div>
      <div className="flex gap-1.5">
        <PixelButton
          variant="mint"
          size="sm"
          onClick={onApprove}
          isLoading={isApproving}
          disabled={isRejecting}
        >
          <CheckCircle size={12} />
        </PixelButton>
        <PixelButton
          variant="blush"
          size="sm"
          onClick={onReject}
          isLoading={isRejecting}
          disabled={isApproving}
        >
          <XCircle size={12} />
        </PixelButton>
      </div>
    </motion.div>
  );
}

function PendingUsersWidget() {
  const { data: pendingUsers, isPending: isLoading } = usePendingUsers();
  const approveMutation = useApproveUser();
  const rejectMutation = useRejectUser();

  const [optimisticUsers, updateOptimisticUsers] = useOptimistic(
    pendingUsers || [],
    (state, removedId: string) => state.filter(u => u.id !== Number(removedId))
  );

  const [isPending, startTransition] = useTransition();

  const handleApprove = (userId: string) => {
    startTransition(() => {
      updateOptimisticUsers(userId);
    });
    approveMutation.mutate({ userId: Number(userId) });
  };

  const handleReject = (userId: string) => {
    startTransition(() => {
      updateOptimisticUsers(userId);
    });
    rejectMutation.mutate({ userId: Number(userId) });
  };

  const count = optimisticUsers.length;

  return (
    <PixelCard hover={false} className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[rgb(var(--peach))]" />
          <h2 className="font-pixel text-sm text-[rgb(var(--charcoal))]">
            Menunggu Persetujuan
          </h2>
        </div>
        {count > 0 && (
          <span className="px-2 py-0.5 bg-[rgb(var(--warning))] text-[10px] font-pixel">
            {count}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : count === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-10 h-10 mx-auto mb-3 text-[rgb(var(--mint))]" />
          <p className="text-sm text-[rgb(var(--slate))]">
            Tidak ada pendaftaran menunggu
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {optimisticUsers.slice(0, 4).map((user) => (
            <PendingUserCard
              key={user.id}
              user={user}
              onApprove={() => handleApprove(String(user.id))}
              onReject={() => handleReject(String(user.id))}
              isApproving={approveMutation.isPending}
              isRejecting={rejectMutation.isPending}
            />
          ))}

          {count > 4 && (
            <Link href="/dashboard/users">
              <PixelButton variant="ghost" className="w-full mt-2 cursor-pointer" size="sm">
                Lihat semua ({count - 4} lainnya)
                <ArrowRight size={12} />
              </PixelButton>
            </Link>
          )}
        </div>
      )}
    </PixelCard>
  );
}

function QuickActions() {
  const actions = [
    {
      label: 'Pengumuman',
      icon: Megaphone,
      href: '/dashboard/announcements',
      color: 'bg-[rgb(var(--peach))/0.3]'
    },
    {
      label: 'Upload Foto',
      icon: Image,
      href: '/dashboard/gallery',
      color: 'bg-[rgb(var(--mint))/0.3]'
    },
    {
      label: 'Anggota',
      icon: Users,
      href: '/dashboard/members',
      color: 'bg-[rgb(var(--blush))/0.3]'
    },
    {
      label: 'Proyek',
      icon: Rocket,
      href: '/dashboard/projects',
      color: 'bg-[rgb(var(--sky))/0.3]'
    },
  ];

  return (
    <PixelCard hover={false} className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Plus size={16} className="text-[rgb(var(--mint))]" />
        <h2 className="font-pixel text-sm text-[rgb(var(--charcoal))]">
          Aksi Cepat
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link key={action.label} href={action.href}>
            <button className={`w-full p-4 ${action.color} border border-[rgb(var(--border))] text-left transition-all hover:brightness-95 cursor-pointer`}>
              <action.icon size={18} className="mb-2 text-[rgb(var(--charcoal))]" />
              <span className="text-xs font-medium text-[rgb(var(--charcoal))]">
                {action.label}
              </span>
            </button>
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}

function RecentActivity() {
  const { data: announcements, isPending } = useAnnouncements();

  return (
    <PixelCard hover={false} className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-pixel text-sm text-[rgb(var(--charcoal))]">
          Aktivitas Terbaru
        </h2>
      </div>

      {isPending ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : !announcements?.length ? (
        <div className="text-center py-8">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-[rgb(var(--muted))]" />
          <p className="text-sm text-[rgb(var(--slate))]">
            Belum ada aktivitas
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {announcements.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 bg-[rgb(var(--stone))] border border-[rgb(var(--border))]"
            >
              <div className="p-1.5 bg-[rgb(var(--peach))/0.4]">
                <Megaphone size={12} className="text-[rgb(var(--charcoal))]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[rgb(var(--charcoal))] truncate">
                  {item.title}
                </p>
                <p className="text-[10px] text-[rgb(var(--muted))]">
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PixelCard>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: announcements } = useAnnouncements();
  const { data: pendingUsers } = usePendingUsers();

  const stats = [
    {
      label: 'Pengumuman',
      value: announcements?.length || 0,
      icon: Megaphone,
      href: '/dashboard/announcements',
      trend: '+2 minggu ini'
    },
    /*{ 
      label: 'Galeri', 
      value: gallery?.meta?.total || 0, 
      icon: Image,
      href: '/dashboard/gallery',
    },
    { 
      label: 'Anggota', 
      value: members?.meta?.total || 0, 
      icon: Users,
      href: '/dashboard/members',
    },
    { 
      label: 'Proyek', 
      value: projects?.meta?.total || 0, 
      icon: Rocket,
      href: '/dashboard/projects',
    }, */
  ];

  const pendingCount = pendingUsers?.length || 0;

  return (

    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="font-pixel text-xl text-[rgb(var(--charcoal))]">
          Dashboard
        </h1>
        <p className="text-sm text-[rgb(var(--slate))] mt-1">
          Yeyyy Halooo, {user?.name?.split(' ')[0]}
        </p>
      </motion.div>

      {pendingCount > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between p-4 bg-[rgb(var(--warning))/0.2] border border-[rgb(var(--warning))/0.4]">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-[rgb(var(--charcoal))]" />
              <div>
                <p className="text-sm font-medium text-[rgb(var(--charcoal))]">
                  {pendingCount} pendaftaran menunggu persetujuan
                </p>
              </div>
            </div>
            <Link href="/dashboard/users">
              <PixelButton variant="ghost" size="sm">
                Kelola
                <ArrowRight size={12} />
              </PixelButton>
            </Link>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <PendingUsersWidget />

        <QuickActions />

        <RecentActivity />
      </motion.div>
    </motion.div>
  );
}