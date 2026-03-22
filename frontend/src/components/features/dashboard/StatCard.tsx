import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="glass-panel p-6 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-start">
        <span className="text-[10px] uppercase tracking-[0.15em] text-outline font-semibold">
          {title}
        </span>
        <Icon className="text-primary w-5 h-5" />
      </div>
      <div className="mt-4">
        <h3 className="font-headline text-4xl font-bold tracking-tight text-on-surface">
          {value}
        </h3>
        {subtitle && (
          <p className="text-[10px] text-primary mt-1 font-medium">{subtitle}</p>
        )}
        {trend && (
          <p className="text-[10px] text-primary mt-1 font-medium flex items-center gap-1">
            <span>{trend.direction === 'up' ? '↑' : '↓'} {trend.value}% from last month</span>
          </p>
        )}
      </div>
    </div>
  );
}
