export function CertificateTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 px-6 mb-4">
        <div className="col-span-3 h-4 bg-surface animate-pulse rounded" />
        <div className="col-span-2 h-4 bg-surface animate-pulse rounded" />
        <div className="col-span-2 h-4 bg-surface animate-pulse rounded" />
        <div className="col-span-2 h-4 bg-surface animate-pulse rounded" />
        <div className="col-span-2 h-4 bg-surface animate-pulse rounded" />
        <div className="col-span-1 h-4 bg-surface animate-pulse rounded" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="glass-panel px-6 py-5 rounded-sm animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-surface rounded" />
              <div className="h-3 w-24 bg-surface rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
