export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-48 bg-surface animate-pulse rounded" />
        <div className="h-4 w-80 bg-surface animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel p-6 min-h-[160px] animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 min-h-[400px] animate-pulse" />
        <div className="glass-panel p-8 min-h-[400px] animate-pulse" />
      </div>
    </div>
  );
}
