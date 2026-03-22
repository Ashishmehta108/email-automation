import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ReactNode } from 'react';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-surface-lowest">
      <Sidebar />
      <Topbar />
      <main className="ml-[240px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
