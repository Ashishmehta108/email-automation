#!/usr/bin/env node
/**
 * AGENT 1 - Infrastructure + Dashboard + Certificates + Settings
 * Works 100% in parallel with Agent 2
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const FRONTEND_DIR = process.cwd();
const AGENTS_DIR = join(FRONTEND_DIR, 'agents');
const LOCK_FILE = join(AGENTS_DIR, 'agent1.lock');
const SHARED_STATE = join(AGENTS_DIR, 'shared-state.json');

function updateLock(data) {
  const lock = JSON.parse(readFileSync(LOCK_FILE, 'utf-8'));
  Object.assign(lock, data);
  lock.lastUpdate = new Date().toISOString();
  writeFileSync(LOCK_FILE, JSON.stringify(lock, null, 2));
}

function updateSharedState(updates) {
  const state = JSON.parse(readFileSync(SHARED_STATE, 'utf-8'));
  Object.assign(state, updates);
  state.lastSync = new Date().toISOString();
  writeFileSync(SHARED_STATE, JSON.stringify(state, null, 2));
}

function log(message) {
  console.log('[Agent 1] ' + message);
  updateLock({ message: message });
}

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// ============ PHASE 0: Configuration ============
function phase0() {
  log('Starting Phase 0: Tailwind config + globals.css + utils + fonts');
  updateLock({ phase: 'P0', task: 'Configuring Tailwind with Obsidian Glass theme', status: 'in_progress' });

  // tailwind.config.ts
  const tailwindConfig = `import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'surface-lowest': '#0e0e0e',
        'surface-low': '#1c1b1b',
        'surface': '#201f1f',
        'surface-high': '#2a2a2a',
        'surface-highest': '#353534',
        'surface-bright': '#3a3939',
        'primary': '#acc7ff',
        'primary-container': '#508ff8',
        'primary-fixed': '#d7e2ff',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#c2c6d5',
        'outline': '#8c909e',
        'outline-variant': '#424753',
        'error': '#ffb4ab',
        'error-container': '#93000a',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      boxShadow: {
        'ghost': '0 40px 40px 0 rgba(0, 0, 0, 0.08)',
        'glow-primary': '0 0 15px rgba(172, 199, 255, 0.3)',
      },
      backdropBlur: {
        xs: '8px',
        sm: '16px',
        DEFAULT: '24px',
        md: '32px',
        lg: '48px',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #acc7ff 0%, #508ff8 100%)',
      },
    },
  },
  plugins: [],
}

export default config
`;
  writeFileSync(join(FRONTEND_DIR, 'tailwind.config.ts'), tailwindConfig);
  log('Created tailwind.config.ts');

  // globals.css
  const globalsCss = `@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

@theme inline {
  --color-surface-lowest: #0e0e0e;
  --color-surface-low: #1c1b1b;
  --color-surface: #201f1f;
  --color-surface-high: #2a2a2a;
  --color-surface-highest: #353534;
  --color-surface-bright: #3a3939;
  --color-primary: #acc7ff;
  --color-primary-container: #508ff8;
  --color-primary-fixed: #d7e2ff;
  --color-on-surface: #e5e2e1;
  --color-on-surface-variant: #c2c6d5;
  --color-outline: #8c909e;
  --color-outline-variant: #424753;
  --color-error: #ffb4ab;
  --color-error-container: #93000a;
  --font-headline: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-label: 'Inter', sans-serif;
}

html {
  font-family: 'Inter', system-ui, sans-serif;
}

body {
  @apply bg-surface-lowest text-on-surface antialiased;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  @apply bg-surface-lowest;
}

::-webkit-scrollbar-thumb {
  @apply bg-surface-highest rounded;
}

::selection {
  @apply bg-primary/30;
}

.glass-panel {
  @apply bg-[rgba(32,31,31,0.6)] backdrop-blur-md border border-[rgba(66,71,83,0.2)];
}

.ghost-border {
  @apply border border-outline-variant/20;
}

.ghost-shadow {
  box-shadow: 0 40px 40px 0 rgba(0, 0, 0, 0.08);
}

.btn-primary-gradient {
  @apply bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold;
  box-shadow: 0 0 15px rgba(172, 199, 255, 0.3);
}

.text-display {
  @apply font-headline text-4xl font-light tracking-tight;
}

.text-headline {
  @apply font-headline text-2xl font-light tracking-tight;
}

.text-stats {
  @apply font-headline tracking-widest;
}

.input-base {
  @apply bg-surface-lowest border-none ring-1 ring-white/5 focus:ring-primary/40 text-sm px-4 py-3 text-on-surface rounded-sm transition-all placeholder:text-outline;
}
`;
  writeFileSync(join(FRONTEND_DIR, 'src/app/globals.css'), globalsCss);
  log('Created src/app/globals.css');

  // Create src/lib directory
  const libDir = join(FRONTEND_DIR, 'src/lib');
  ensureDir(libDir);

  // utils.ts
  const utils = `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  generated: 'bg-blue-50 text-blue-700 border-blue-200',
  sent: 'bg-green-50 text-green-700 border-green-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return minutes + 'm ago';
  if (hours < 24) return hours + 'h ago';
  return days + 'd ago';
}
`;
  writeFileSync(join(libDir, 'utils.ts'), utils);
  log('Created src/lib/utils.ts');

  // fonts.ts
  const fonts = `import { Space_Grotesk, Inter } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['300', '400', '500', '600', '700'],
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
});
`;
  writeFileSync(join(libDir, 'fonts.ts'), fonts);
  log('Created src/lib/fonts.ts');

  updateLock({ phase: 'P0', status: 'completed', task: null });
  updateSharedState({ projectState: { initialized: true, phaseStatus: { P0: 'completed' } } });
  log('Phase 0 completed!');
}

// ============ PHASE 1: Core Libraries ============
function phase1() {
  log('Starting Phase 1: Auth client, Query client, API layer, Root layout');
  updateLock({ phase: 'P1', task: 'Creating core libraries and root layout', status: 'in_progress' });

  const libDir = join(FRONTEND_DIR, 'src/lib');

  // auth-client.ts
  const authClient = `"use client";

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;
`;
  writeFileSync(join(libDir, 'auth-client.ts'), authClient);
  log('Created src/lib/auth-client.ts');

  // query-client.ts
  const queryClient = `"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return createQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
`;
  writeFileSync(join(libDir, 'query-client.ts'), queryClient);
  log('Created src/lib/query-client.ts');

  // Create src/api directory
  const apiDir = join(FRONTEND_DIR, 'src/api');
  ensureDir(apiDir);

  // api.ts
  const api = `const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  issues?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(BASE + path, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || 'Request failed');
  }

  return json;
}

export async function apiFetchBlob(
  path: string,
  init?: RequestInit
): Promise<Blob> {
  const res = await fetch(BASE + path, {
    ...init,
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Request failed');
  }

  return res.blob();
}
`;
  writeFileSync(join(apiDir, 'api.ts'), api);
  log('Created src/api/api.ts');

  // Create types directory
  const typesDir = join(FRONTEND_DIR, 'src/types');
  ensureDir(typesDir);

  // common.types.ts
  const commonTypes = `export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  count: number;
}

export interface StatsData {
  students: { total: number };
  templates: { total: number; active: number };
  certificates: {
    pending: number;
    generated: number;
    sent: number;
    failed: number;
  };
  emails: { sent: number; failed: number };
}

export type CertificateStatus = 'pending' | 'generated' | 'sent' | 'failed';
`;
  writeFileSync(join(typesDir, 'common.types.ts'), commonTypes);
  log('Created src/types/common.types.ts');

  // Update layout.tsx
  const layout = `"use client";

import { QueryProvider } from '@/lib/query-client';
import { Toaster } from 'sonner';
import { spaceGrotesk, inter } from '@/lib/fonts';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={spaceGrotesk.variable + ' ' + inter.variable + ' font-body'}>
        <QueryProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
`;
  writeFileSync(join(FRONTEND_DIR, 'src/app/layout.tsx'), layout);
  log('Updated src/app/layout.tsx');

  // Update page.tsx (redirect to dashboard)
  const page = `import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
`;
  writeFileSync(join(FRONTEND_DIR, 'src/app/page.tsx'), page);
  log('Updated src/app/page.tsx');

  updateLock({ phase: 'P1', status: 'completed', task: null });
  updateSharedState({ projectState: { phaseStatus: { P1: 'completed' } } });
  log('Phase 1 completed!');
}

// ============ PHASE 2: Dashboard ============
function phase2() {
  log('Starting Phase 2: Dashboard page');
  updateLock({ phase: 'P2', task: 'Building Dashboard components', status: 'in_progress' });

  // Create directories
  const hooksDir = join(FRONTEND_DIR, 'src/hooks');
  const featuresDir = join(FRONTEND_DIR, 'src/components/features');
  const dashboardDir = join(featuresDir, 'dashboard');
  const dashboardPageDir = join(FRONTEND_DIR, 'src/app/(dashboard)/dashboard');

  [hooksDir, featuresDir, dashboardDir, dashboardPageDir].forEach(dir => {
    ensureDir(dir);
  });

  // useDashboard.ts
  const useDashboard = `"use client";

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/api/api';
import type { StatsData } from '@/types/common.types';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await apiFetch<StatsData>('/api/stats');
      return res.data;
    },
  });
}
`;
  writeFileSync(join(hooksDir, 'useDashboard.ts'), useDashboard);
  log('Created src/hooks/useDashboard.ts');

  // StatCard.tsx
  const statCard = `import { LucideIcon } from 'lucide-react';

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
`;
  writeFileSync(join(dashboardDir, 'StatCard.tsx'), statCard);
  log('Created src/components/features/dashboard/StatCard.tsx');

  // StatsGrid.tsx
  const statsGrid = `"use client";

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
`;
  writeFileSync(join(dashboardDir, 'StatsGrid.tsx'), statsGrid);
  log('Created src/components/features/dashboard/StatsGrid.tsx');

  // RecentOperations.tsx
  const recentOps = `"use client";

import { Mail, FileCheck, Refresh2, AlertCircle } from 'lucide-react';

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
  sync: Refresh2,
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
`;
  writeFileSync(join(dashboardDir, 'RecentOperations.tsx'), recentOps);
  log('Created src/components/features/dashboard/RecentOperations.tsx');

  // StatusBreakdown.tsx
  const statusBreakdown = `"use client";

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
`;
  writeFileSync(join(dashboardDir, 'StatusBreakdown.tsx'), statusBreakdown);
  log('Created src/components/features/dashboard/StatusBreakdown.tsx');

  // DashboardSkeleton.tsx
  const skeleton = `export function DashboardSkeleton() {
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
`;
  writeFileSync(join(dashboardDir, 'DashboardSkeleton.tsx'), skeleton);
  log('Created src/components/features/dashboard/DashboardSkeleton.tsx');

  // Dashboard page.tsx
  const dashboardPage = `"use client";

import { StatsGrid } from '@/components/features/dashboard/StatsGrid';
import { RecentOperations } from '@/components/features/dashboard/RecentOperations';
import { StatusBreakdown } from '@/components/features/dashboard/StatusBreakdown';

export default function DashboardPage() {
  return (
    <section className="p-10 max-w-7xl w-full mx-auto space-y-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
          System Overview
        </h2>
        <p className="font-body text-sm text-outline tracking-wide">
          Real-time automation engine performance metrics.
        </p>
      </div>
      
      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentOperations />
        </div>
        <div>
          <StatusBreakdown />
        </div>
      </div>
    </section>
  );
}
`;
  writeFileSync(join(dashboardPageDir, 'page.tsx'), dashboardPage);
  log('Created src/app/(dashboard)/dashboard/page.tsx');

  updateLock({ phase: 'P2', status: 'completed', task: null });
  updateSharedState({ projectState: { phaseStatus: { P2: 'completed' } } });
  log('Phase 2 completed!');
}

// ============ MAIN EXECUTION ============
async function main() {
  log('Agent 1 starting...');
  updateSharedState({ agent1: { status: 'running', startedAt: new Date().toISOString() } });

  try {
    phase0();
    phase1();
    phase2();
    log('Agent 1 completed phases P0, P1, P2. Ready for P4, P6.');
    updateLock({ status: 'completed', message: 'Agent 1 completed P0, P1, P2' });
  } catch (error) {
    log('Error: ' + error);
    updateLock({ status: 'error', message: String(error) });
  }
}

main();
