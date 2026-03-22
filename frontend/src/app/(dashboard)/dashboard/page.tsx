"use client";

import { StatsGrid } from '@/components/features/dashboard/StatsGrid';
import { RecentOperations } from '@/components/features/dashboard/RecentOperations';
import { StatusBreakdown } from '@/components/features/dashboard/StatusBreakdown';

export default function DashboardPage() {
  return (
    <section className="p-10 max-w-7xl w-full mx-auto space-y-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
          System Overview
        </h2>
        <p className="font-body text-sm text-outline tracking-wide">
          Real-time automation engine performance metrics.
        </p>
      </div>
      
      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentOperations />
        </div>
        <div>
          <StatusBreakdown />
        </div>
      </div>
    </section>
  );
}
