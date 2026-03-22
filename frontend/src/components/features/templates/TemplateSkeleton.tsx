export function TemplateSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass-panel px-6 py-5 rounded-sm animate-pulse">
          <div className="space-y-3">
            <div className="h-4 w-1/3 bg-surface rounded" />
            <div className="h-3 w-1/2 bg-surface rounded" />
            <div className="h-3 w-full bg-surface rounded" />
            <div className="h-3 w-2/3 bg-surface rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
