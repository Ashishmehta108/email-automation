"use client";

import { Users, FileCheck, Mail, AlertCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { useDashboard } from '@/hooks/useDashboard';

export function StatsGrid() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel p-6 min-h-[160px] animate-pulse bg-surface/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Students"
        value={data.students.total.toLocaleString()}
        icon={Users}
        trend={{ value: 12, direction: 'up' }}
      />
      <StatCard
        title="Certificates"
        value={data.certificates.generated.toLocaleString()}
        subtitle={data.certificates.pending + ' pending'}
        icon={FileCheck}
      />
      <StatCard
        title="Emails Sent"
        value={data.emails.sent.toLocaleString()}
        icon={Mail}
      />
      <StatCard
        title="Failed"
        value={data.emails.failed.toLocaleString()}
        subtitle={data.certificates.failed + ' cert failures'}
        icon={AlertCircle}
      />
    </div>
  );
}
