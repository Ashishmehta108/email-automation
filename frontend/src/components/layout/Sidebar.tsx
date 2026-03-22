"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Award, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/certificates', label: 'Certificates', icon: Award },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface-low/60 backdrop-blur-md border-r border-outline-variant/20 ghost-shadow flex flex-col py-8 px-4 z-50">
      <div className="mb-12 px-2">
        <h1 className="font-headline text-xl font-light tracking-tight text-on-surface">
          Email Automation
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-medium mt-1">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? 'flex items-center gap-3 px-3 py-3 transition-all duration-300 font-label text-sm font-medium tracking-[0.02em] bg-white/[0.05] text-primary border-l-2 border-primary'
                  : 'flex items-center gap-3 px-3 py-3 transition-all duration-300 font-label text-sm font-medium tracking-[0.02em] text-outline hover:text-on-surface hover:bg-white/[0.05]'
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/30 flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-highest">
          <div className="w-full h-full flex items-center justify-center text-xs font-medium text-primary">
            A
          </div>
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-medium text-on-surface truncate">Admin</p>
          <p className="text-[10px] text-outline truncate">admin@example.com</p>
        </div>
      </div>
    </aside>
  );
}
