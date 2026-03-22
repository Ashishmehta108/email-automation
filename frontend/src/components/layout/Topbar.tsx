"use client";

import { Bell, HelpCircle, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Topbar() {
  return (
    <header className="sticky top-0 w-[calc(100%-240px)] ml-[240px] z-40 bg-surface-low/60 backdrop-blur-md border-b border-outline-variant/20 ghost-shadow">
      <div className="flex justify-between items-center px-8 h-20">
        <div className="flex items-center gap-8 flex-1">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-surface-lowest border-none text-sm px-10 py-2 rounded-sm focus:ring-1 focus:ring-primary/40 text-on-surface placeholder:text-outline"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ThemeToggle />
          <button className="text-outline hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-outline hover:text-primary transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="h-8 w-[1px] bg-outline-variant/30" />
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-on-surface-variant">Admin Console</span>
            <div className="w-8 h-8 rounded-full bg-surface-highest flex items-center justify-center text-xs font-medium text-primary border border-outline-variant/30">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
