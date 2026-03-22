"use client";

export function StatusBreakdown() {
  return (
    <div className="glass-panel p-8 flex flex-col">
      <h3 className="font-headline text-xl font-light text-on-surface mb-8">Status Breakdown</h3>
      
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-surface-highest"
            cx="96"
            cy="96"
            fill="transparent"
            r="80"
            stroke="currentColor"
            strokeWidth="8"
          />
          <circle
            className="text-primary"
            cx="96"
            cy="96"
            fill="transparent"
            r="80"
            stroke="currentColor"
            strokeDasharray="502.6"
            strokeDashoffset="125.6"
            strokeWidth="12"
          />
          <circle
            className="text-tertiary"
            cx="96"
            cy="96"
            fill="transparent"
            r="80"
            stroke="currentColor"
            strokeDasharray="502.6"
            strokeDashoffset="427.2"
            strokeWidth="12"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-headline text-3xl font-bold">92%</span>
          <span className="font-label text-[10px] uppercase tracking-widest text-outline">Health</span>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-label text-xs text-on-surface-variant">Delivered</span>
          </div>
          <span className="font-headline text-sm font-medium">75%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="font-label text-xs text-on-surface-variant">In Queue</span>
          </div>
          <span className="font-headline text-sm font-medium">15%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-error" />
            <span className="font-label text-xs text-on-surface-variant">Bounced</span>
          </div>
          <span className="font-headline text-sm font-medium">10%</span>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="p-4 bg-surface-lowest rounded border border-white/5">
          <p className="text-[10px] text-outline leading-relaxed">
            System running at peak efficiency. No critical infrastructure alerts detected.
          </p>
        </div>
      </div>
    </div>
  );
}
