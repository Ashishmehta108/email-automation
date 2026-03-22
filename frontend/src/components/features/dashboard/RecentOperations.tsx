"use client";

import { Mail, FileCheck, AlertCircle, RefreshCcw } from 'lucide-react';


const operations = [
  { id: 1, type: 'email', title: 'Welcome Sequence: Phase 1', status: 'sent', time: '2m ago' },
  { id: 2, type: 'cert', title: 'PDF Certificate: Cloud Architect', status: 'generated', time: '14m ago' },
  { id: 3, type: 'sync', title: 'Webhook Sync: LMS Integration', status: 'pending', time: '22m ago' },
  { id: 4, type: 'email', title: 'Course Update Notification', status: 'sent', time: '45m ago' },
  { id: 5, type: 'error', title: 'SMTP Handshake Error', status: 'failed', time: '1h ago' },
];

const statusColors: Record<string, string> = {
  sent: 'bg-[#0d2d2d] text-[#4fd1d1] border-[#4fd1d1]/20',
  generated: 'bg-[#2d0d2d] text-[#d14fd1] border-[#d14fd1]/20',
  pending: 'bg-[#0d1a2d] text-[#4f9ed1] border-[#4f9ed1]/20',
  failed: 'bg-[#2d0d0d] text-[#d14f4f] border-[#d14f4f]/20',
};

const icons: Record<string, any> = {
  email: Mail,
  cert: FileCheck,
  sync: RefreshCcw,
  error: AlertCircle,
};

export function RecentOperations() {
  return (
    <div className="glass-panel p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline text-xl font-light text-on-surface">Recent Operations</h3>
        <button className="text-[10px] uppercase tracking-widest text-primary border border-primary/20 px-3 py-1 hover:bg-primary/5 transition-colors">
          View Logs
        </button>
      </div>
      <div className="space-y-2">
        {operations.map((op) => {
          const Icon = icons[op.type] || Mail;
          return (
            <div
              key={op.id}
              className="flex items-center justify-between py-4 group transition-colors hover:bg-white/[0.02] -mx-2 px-2 rounded"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center bg-surface-highest border border-white/5">
                  <Icon className="w-4 h-4 text-outline" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-on-surface">{op.title}</p>
                  <p className="text-[10px] text-outline tracking-wide">ID: #{op.id} - {op.time}</p>
                </div>
              </div>
              <span className={"px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border " + statusColors[op.status]}>
                {op.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
