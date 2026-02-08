'use client';

import { useQuery } from '@tanstack/react-query';
import { getStats, StatsData } from '@/lib/api/stats';

export function useStats() {
    return useQuery<StatsData>({
        queryKey: ['stats'],
        queryFn: getStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}
