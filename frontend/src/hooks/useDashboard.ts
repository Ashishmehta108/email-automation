"use client";

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/api/api';
import type { StatsData } from '@/types/common.types';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await apiFetch<StatsData>('/api/stats');
      return res.data;
    },
  });
}
