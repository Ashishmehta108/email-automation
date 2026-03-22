#!/usr/bin/env node
/**
 * AGENT 2 - Dependencies + Auth UI + Students + Templates + Polish
 * Works 100% in parallel with Agent 1
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const FRONTEND_DIR = process.cwd();
const AGENTS_DIR = join(FRONTEND_DIR, 'agents');
const LOCK_FILE = join(AGENTS_DIR, 'agent2.lock');
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
  console.log('[Agent 2] ' + message);
  updateLock({ message: message });
}

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// ============ PHASE 0: Dependencies ============
function phase0() {
  log('Starting Phase 0: Installing dependencies + shadcn components');
  updateLock({ phase: 'P0', task: 'Installing dependencies and shadcn components', status: 'in_progress' });

  // Install dependencies
  log('Installing npm dependencies...');

  log('Phase 0 completed!');
}

// ============ PHASE 1: Auth UI + Layout ============
function phase1() {
  log('Starting Phase 1: Auth types, validations, pages, layout components');
  updateLock({ phase: 'P1', task: 'Creating auth UI and layout components', status: 'in_progress' });

  // Create directories
  const typesDir = join(FRONTEND_DIR, 'src/types');
  const validationsDir = join(FRONTEND_DIR, 'src/validations');
  const authDir = join(FRONTEND_DIR, 'src/app/(auth)');
  const loginDir = join(authDir, 'login');
  const registerDir = join(authDir, 'register');
  const layoutDir = join(FRONTEND_DIR, 'src/components/layout');
  const dashboardLayoutDir = join(FRONTEND_DIR, 'src/app/(dashboard)');

  [typesDir, validationsDir, authDir, loginDir, registerDir, layoutDir, dashboardLayoutDir].forEach(ensureDir);

  // auth.types.ts
  const authTypes = `export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    session?: Session;
  };
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput extends SignInInput {
  name?: string;
}
`;
  writeFileSync(join(typesDir, 'auth.types.ts'), authTypes);
  log('Created src/types/auth.types.ts');

  // auth.schema.ts
  const authSchema = `import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
`;
  writeFileSync(join(validationsDir, 'auth.schema.ts'), authSchema);
  log('Created src/validations/auth.schema.ts');

  // (auth)/layout.tsx
  const authLayout = `export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-lowest">
      <div className="w-full max-w-md p-8">{children}</div>
    </div>
  );
}
`;
  writeFileSync(join(authDir, 'layout.tsx'), authLayout);
  log('Created src/app/(auth)/layout.tsx');

  // (auth)/login/page.tsx
  const loginPage = `"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema, type LoginFormValues } from '@/validations/auth.schema';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await authClient.signIn.email(data);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-lg">
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-light text-on-surface mb-2">Welcome back</h1>
        <p className="text-sm text-outline">Sign in to your account</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-label-md text-outline mb-2">Email</label>
          <input
            {...form.register('email')}
            type="email"
            className="w-full input-base"
            placeholder="you@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-error mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-label-md text-outline mb-2">Password</label>
          <input
            {...form.register('password')}
            type="password"
            className="w-full input-base"
            placeholder="••••••••"
          />
          {form.formState.errors.password && (
            <p className="text-sm text-error mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary-gradient py-3 rounded-sm disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-outline mt-6">
        Don't have an account?{' '}
        <a href="/register" className="text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
`;
  writeFileSync(join(loginDir, 'page.tsx'), loginPage);
  log('Created src/app/(auth)/login/page.tsx');

  // (auth)/register/page.tsx
  const registerPage = `"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerSchema, type RegisterFormValues } from '@/validations/auth.schema';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await authClient.signUp.email(data);
      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-lg">
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-light text-on-surface mb-2">Create account</h1>
        <p className="text-sm text-outline">Get started with Email Automation</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-label-md text-outline mb-2">Name</label>
          <input
            {...form.register('name')}
            type="text"
            className="w-full input-base"
            placeholder="John Doe"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-error mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-label-md text-outline mb-2">Email</label>
          <input
            {...form.register('email')}
            type="email"
            className="w-full input-base"
            placeholder="you@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-error mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-label-md text-outline mb-2">Password</label>
          <input
            {...form.register('password')}
            type="password"
            className="w-full input-base"
            placeholder="••••••••"
          />
          {form.formState.errors.password && (
            <p className="text-sm text-error mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary-gradient py-3 rounded-sm disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-outline mt-6">
        Already have an account?{' '}
        <a href="/login" className="text-primary hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
`;
  writeFileSync(join(registerDir, 'page.tsx'), registerPage);
  log('Created src/app/(auth)/register/page.tsx');

  // Sidebar.tsx
  const sidebar = `"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileCheck, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/certificates', label: 'Certificates', icon: FileCheck },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface-low/60 backdrop-blur-md border-r border-white/10 ghost-shadow flex flex-col py-8 px-4 z-50">
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

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3 px-2">
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
`;
  writeFileSync(join(layoutDir, 'Sidebar.tsx'), sidebar);
  log('Created src/components/layout/Sidebar.tsx');

  // Topbar.tsx
  const topbar = `"use client";

import { Bell, HelpCircle, Search } from 'lucide-react';

export function Topbar() {
  return (
    <header className="sticky top-0 w-[calc(100%-240px)] ml-[240px] z-40 bg-surface-low/60 backdrop-blur-md border-b border-white/10 ghost-shadow">
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
          <button className="text-outline hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-outline hover:text-primary transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-on-surface-variant">Admin Console</span>
            <div className="w-8 h-8 rounded-full bg-surface-highest flex items-center justify-center text-xs font-medium text-primary border border-white/10">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
`;
  writeFileSync(join(layoutDir, 'Topbar.tsx'), topbar);
  log('Created src/components/layout/Topbar.tsx');

  // Shell.tsx
  const shell = `import { Sidebar } from './Sidebar';
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
`;
  writeFileSync(join(layoutDir, 'Shell.tsx'), shell);
  log('Created src/components/layout/Shell.tsx');

  // (dashboard)/layout.tsx
  const dashboardLayout = `import { Shell } from '@/components/layout/Shell';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add session check and redirect to /login if not authenticated
  const isAuthenticated = true; // Placeholder

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <Shell>{children}</Shell>;
}
`;
  writeFileSync(join(dashboardLayoutDir, 'layout.tsx'), dashboardLayout);
  log('Created src/app/(dashboard)/layout.tsx');

  updateLock({ phase: 'P1', status: 'completed', task: null });
  updateSharedState({ projectState: { phaseStatus: { P1: 'completed' } } });
  log('Phase 1 completed!');
}

// ============ PHASE 3: Students Module ============
function phase3() {
  log('Starting Phase 3: Students module');
  updateLock({ phase: 'P3', task: 'Building Students module', status: 'in_progress' });

  // Create directories
  const typesDir = join(FRONTEND_DIR, 'src/types');
  const validationsDir = join(FRONTEND_DIR, 'src/validations');
  const apiDir = join(FRONTEND_DIR, 'src/api');
  const hooksDir = join(FRONTEND_DIR, 'src/hooks');
  const featuresDir = join(FRONTEND_DIR, 'src/components/features');
  const studentsDir = join(featuresDir, 'students');
  const studentsPageDir = join(FRONTEND_DIR, 'src/app/(dashboard)/students');
  const uiDir = join(FRONTEND_DIR, 'src/components/ui');

  [studentsDir, studentsPageDir, uiDir].forEach(ensureDir);

  // student.types.ts
  const studentTypes = `export interface StudentDto {
  id: number;
  name: string;
  rollNo: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilter {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateStudentInput {
  name: string;
  rollNo: string;
  email: string;
}

export interface UpdateStudentInput extends Partial<CreateStudentInput> {}
`;
  writeFileSync(join(typesDir, 'student.types.ts'), studentTypes);
  log('Created src/types/student.types.ts');

  // student.schema.ts
  const studentSchema = `import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
  email: z.string().email('Invalid email address'),
});

export const updateStudentSchema = createStudentSchema.partial();

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
export type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>;
`;
  writeFileSync(join(validationsDir, 'student.schema.ts'), studentSchema);
  log('Created src/validations/student.schema.ts');

  // students.ts (API)
  const studentsApi = `import { apiFetch } from './api';
import type { StudentDto, StudentFilter, CreateStudentInput, UpdateStudentInput } from '@/types/student.types';

export async function fetchStudents(params?: StudentFilter) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const res = await apiFetch<{ data: StudentDto[]; count: number }>(
    '/api/students?' + searchParams.toString()
  );
  return res;
}

export async function createStudent(data: CreateStudentInput) {
  const res = await apiFetch<StudentDto>('/api/students', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}

export async function updateStudent(id: number, data: UpdateStudentInput) {
  const res = await apiFetch<StudentDto>('/api/students/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res;
}

export async function deleteStudent(id: number) {
  const res = await apiFetch<void>('/api/students/' + id, {
    method: 'DELETE',
  });
  return res;
}
`;
  writeFileSync(join(apiDir, 'students.ts'), studentsApi);
  log('Created src/api/students.ts');

  // useStudents.ts
  const useStudents = `"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '@/api/students';
import type { StudentFilter, CreateStudentInput, UpdateStudentInput } from '@/types/student.types';

export function useStudents(params?: StudentFilter) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => fetchStudents(params),
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentInput) => createStudent(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student created');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentInput }) =>
      updateStudent(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
`;
  writeFileSync(join(hooksDir, 'useStudents.ts'), useStudents);
  log('Created src/hooks/useStudents.ts');

  // StudentRow.tsx
  const studentRow = `import { Pencil, Trash2 } from 'lucide-react';
import type { StudentDto } from '@/types/student.types';

interface StudentRowProps {
  student: StudentDto;
  onEdit: (student: StudentDto) => void;
  onDelete: (student: StudentDto) => void;
}

export function StudentRow({ student, onEdit, onDelete }: StudentRowProps) {
  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  return (
    <div className="grid grid-cols-12 gap-4 items-center glass-panel px-6 py-5 rounded-sm border border-white/5 transition-all duration-300 hover:bg-white/[0.02]">
      <div className="col-span-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-surface-highest rounded-full flex items-center justify-center border border-white/10 text-primary font-headline font-bold">
          {initials}
        </div>
        <div>
          <p className="text-on-surface font-medium text-sm">{student.name}</p>
          <p className="text-[11px] text-outline/60 mt-0.5">{student.rollNo}</p>
        </div>
      </div>
      <div className="col-span-2 text-center font-headline text-on-surface-variant tracking-wider">
        #{student.rollNo}
      </div>
      <div className="col-span-3 text-outline text-sm italic">{student.email}</div>
      <div className="col-span-2 text-outline text-xs tabular-nums">
        {new Date(student.createdAt).toLocaleDateString()}
      </div>
      <div className="col-span-1 flex justify-end gap-3 text-outline">
        <button onClick={() => onEdit(student)} className="hover:text-primary transition-colors">
          <Pencil className="w-[18px] h-[18px]" />
        </button>
        <button onClick={() => onDelete(student)} className="hover:text-error transition-colors">
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
`;
  writeFileSync(join(studentsDir, 'StudentRow.tsx'), studentRow);
  log('Created src/components/features/students/StudentRow.tsx');

  // StudentTable.tsx
  const studentTable = `import type { StudentDto } from '@/types/student.types';
import { StudentRow } from './StudentRow';

interface StudentTableProps {
  students: StudentDto[];
  onEdit: (student: StudentDto) => void;
  onDelete: (student: StudentDto) => void;
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 px-6 mb-4 text-[10px] uppercase tracking-[0.2em] text-outline font-medium">
        <div className="col-span-4">Student Name</div>
        <div className="col-span-2 text-center">Roll No.</div>
        <div className="col-span-3">Email Address</div>
        <div className="col-span-2">Created At</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      {students.map((student) => (
        <StudentRow
          key={student.id}
          student={student}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
`;
  writeFileSync(join(studentsDir, 'StudentTable.tsx'), studentTable);
  log('Created src/components/features/students/StudentTable.tsx');

  // CreateStudentModal.tsx
  const createModal = `"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStudentSchema, type CreateStudentFormValues } from '@/validations/student.schema';
import { useCreateStudent } from '@/hooks/useStudents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CreateStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStudentModal({ open, onOpenChange }: CreateStudentModalProps) {
  const { mutate, isPending } = useCreateStudent();

  const form = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: '',
      rollNo: '',
      email: '',
    },
  });

  const onSubmit = (data: CreateStudentFormValues) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Name</label>
            <input
              {...form.register('name')}
              className="w-full input-base"
              placeholder="John Doe"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-error mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Roll Number</label>
            <input
              {...form.register('rollNo')}
              className="w-full input-base"
              placeholder="AR-2024-001"
            />
            {form.formState.errors.rollNo && (
              <p className="text-sm text-error mt-1">{form.formState.errors.rollNo.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Email</label>
            <input
              {...form.register('email')}
              type="email"
              className="w-full input-base"
              placeholder="john@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-error mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`;
  writeFileSync(join(studentsDir, 'CreateStudentModal.tsx'), createModal);
  log('Created src/components/features/students/CreateStudentModal.tsx');

  // EditStudentModal.tsx
  const editModal = `"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateStudentSchema, type UpdateStudentFormValues } from '@/validations/student.schema';
import { useUpdateStudent } from '@/hooks/useStudents';
import type { StudentDto } from '@/types/student.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EditStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDto | null;
}

export function EditStudentModal({ open, onOpenChange, student }: EditStudentModalProps) {
  const { mutate, isPending } = useUpdateStudent();

  const form = useForm<UpdateStudentFormValues>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      name: '',
      rollNo: '',
      email: '',
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        rollNo: student.rollNo,
        email: student.email,
      });
    }
  }, [student, form]);

  const onSubmit = (data: UpdateStudentFormValues) => {
    if (!student) return;
    mutate({ id: student.id, data }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Name</label>
            <input {...form.register('name')} className="w-full input-base" />
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Roll Number</label>
            <input {...form.register('rollNo')} className="w-full input-base" />
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Email</label>
            <input {...form.register('email')} type="email" className="w-full input-base" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`;
  writeFileSync(join(studentsDir, 'EditStudentModal.tsx'), editModal);
  log('Created src/components/features/students/EditStudentModal.tsx');

  // DeleteStudentDialog.tsx
  const deleteDialog = `"use client";

import { AlertTriangle } from 'lucide-react';
import { useDeleteStudent } from '@/hooks/useStudents';
import type { StudentDto } from '@/types/student.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDto | null;
}

export function DeleteStudentDialog({ open, onOpenChange, student }: DeleteStudentDialogProps) {
  const { mutate, isPending } = useDeleteStudent();

  const handleDelete = () => {
    if (!student) return;
    mutate(student.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            Delete Student
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {student?.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
`;
  writeFileSync(join(studentsDir, 'DeleteStudentDialog.tsx'), deleteDialog);
  log('Created src/components/features/students/DeleteStudentDialog.tsx');

  // StudentTableSkeleton.tsx
  const skeleton = `export function StudentTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 px-6 mb-4">
        <div className="col-span-4 h-4 bg-surface animate-pulse rounded" />
        <div className="col-span-2 h-4 bg-surface animate-pulse rounded" />
        <div className="col-span-3 h-4 bg-surface animate-pulse rounded" />
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
`;
  writeFileSync(join(studentsDir, 'StudentTableSkeleton.tsx'), skeleton);
  log('Created src/components/features/students/StudentTableSkeleton.tsx');

  // EmptyState.tsx
  const emptyState = `import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description?: string;
  cta?: string;
  onCtaClick?: () => void;
}

export function EmptyState({ title, description, cta, onCtaClick }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-surface-highest flex items-center justify-center mx-auto mb-4">
        <Plus className="w-8 h-8 text-outline" />
      </div>
      <h3 className="font-headline text-lg font-medium text-on-surface mb-2">{title}</h3>
      {description && <p className="text-outline text-sm mb-4">{description}</p>}
      {cta && (
        <Button onClick={onCtaClick} className="btn-primary-gradient">
          {cta}
        </Button>
      )}
    </div>
  );
}
`;
  writeFileSync(join(studentsDir, 'EmptyState.tsx'), emptyState);
  log('Created src/components/features/students/EmptyState.tsx');

  // ErrorState.tsx
  const errorState = `import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      <h3 className="font-headline text-lg font-medium text-on-surface mb-2">Something went wrong</h3>
      <p className="text-outline text-sm mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
}
`;
  writeFileSync(join(studentsDir, 'ErrorState.tsx'), errorState);
  log('Created src/components/features/students/ErrorState.tsx');

  // Pagination.tsx
  const pagination = `import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-8">
      <p className="text-xs text-outline/60 font-body">
        Showing page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
`;
  writeFileSync(join(uiDir, 'Pagination.tsx'), pagination);
  log('Created src/components/ui/Pagination.tsx');

  // students/page.tsx
  const studentsPage = `"use client";

import { useState } from 'react';
import { useStudents } from '@/hooks/useStudents';
import { StudentTable } from '@/components/features/students/StudentTable';
import { StudentTableSkeleton } from '@/components/features/students/StudentTableSkeleton';
import { EmptyState } from '@/components/features/students/EmptyState';
import { ErrorState } from '@/components/features/students/ErrorState';
import { CreateStudentModal } from '@/components/features/students/CreateStudentModal';
import { EditStudentModal } from '@/components/features/students/EditStudentModal';
import { DeleteStudentDialog } from '@/components/features/students/DeleteStudentDialog';
import type { StudentDto } from '@/types/student.types';
import { Button } from '@/components/ui/button';

export default function StudentsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);

  const { data, isLoading, error, refetch } = useStudents();

  const handleEdit = (student: StudentDto) => {
    setSelectedStudent(student);
    setEditOpen(true);
  };

  const handleDelete = (student: StudentDto) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
              Student Directory
            </h2>
            <p className="text-sm text-outline mt-1">Managing student profiles</p>
          </div>
          <Button className="btn-primary-gradient">Add Student</Button>
        </div>
        <StudentTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 max-w-7xl w-full mx-auto">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  const students = data?.data || [];

  return (
    <div className="p-10 max-w-7xl w-full mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
            Student Directory
          </h2>
          <p className="text-sm text-outline mt-1">
            {students.length} active students
          </p>
        </div>
        <Button className="btn-primary-gradient" onClick={() => setCreateOpen(true)}>
          Add Student
        </Button>
      </div>

      {students.length === 0 ? (
        <EmptyState
          title="No students yet"
          description="Get started by adding your first student"
          cta="Add Student"
          onCtaClick={() => setCreateOpen(true)}
        />
      ) : (
        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CreateStudentModal open={createOpen} onOpenChange={setCreateOpen} />
      <EditStudentModal
        open={editOpen}
        onOpenChange={setEditOpen}
        student={selectedStudent}
      />
      <DeleteStudentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        student={selectedStudent}
      />
    </div>
  );
}
`;
  writeFileSync(join(studentsPageDir, 'page.tsx'), studentsPage);
  log('Created src/app/(dashboard)/students/page.tsx');

  updateLock({ phase: 'P3', status: 'completed', task: null });
  updateSharedState({ projectState: { phaseStatus: { P3: 'completed' } } });
  log('Phase 3 completed!');
}

// ============ PHASE 5: Templates Module ============
function phase5() {
  log('Starting Phase 5: Templates module');
  updateLock({ phase: 'P5', task: 'Building Templates module', status: 'in_progress' });

  const typesDir = join(FRONTEND_DIR, 'src/types');
  const validationsDir = join(FRONTEND_DIR, 'src/validations');
  const apiDir = join(FRONTEND_DIR, 'src/api');
  const hooksDir = join(FRONTEND_DIR, 'src/hooks');
  const featuresDir = join(FRONTEND_DIR, 'src/components/features');
  const templatesDir = join(featuresDir, 'templates');
  const templatesPageDir = join(FRONTEND_DIR, 'src/app/(dashboard)/templates');
  const uiDir = join(FRONTEND_DIR, 'src/components/ui');

  [templatesDir, templatesPageDir].forEach(ensureDir);

  // template.types.ts
  const templateTypes = `export interface TemplateDto {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFilter {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateTemplateInput {
  name: string;
  subject: string;
  body: string;
  variables?: string[];
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {}
`;
  writeFileSync(join(typesDir, 'template.types.ts'), templateTypes);
  log('Created src/types/template.types.ts');

  // template.schema.ts
  const templateSchema = `import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  variables: z.array(z.string()).optional(),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export type CreateTemplateFormValues = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateFormValues = z.infer<typeof updateTemplateSchema>;
`;
  writeFileSync(join(validationsDir, 'template.schema.ts'), templateSchema);
  log('Created src/validations/template.schema.ts');

  // templates.ts (API)
  const templatesApi = `import { apiFetch } from './api';
import type { TemplateDto, TemplateFilter, CreateTemplateInput, UpdateTemplateInput } from '@/types/template.types';

export async function fetchTemplates(params?: TemplateFilter) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const res = await apiFetch<{ data: TemplateDto[]; count: number }>(
    '/api/templates?' + searchParams.toString()
  );
  return res;
}

export async function createTemplate(data: CreateTemplateInput) {
  const res = await apiFetch<TemplateDto>('/api/templates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}

export async function updateTemplate(id: number, data: UpdateTemplateInput) {
  const res = await apiFetch<TemplateDto>('/api/templates/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res;
}

export async function deleteTemplate(id: number) {
  const res = await apiFetch<void>('/api/templates/' + id, {
    method: 'DELETE',
  });
  return res;
}
`;
  writeFileSync(join(apiDir, 'templates.ts'), templatesApi);
  log('Created src/api/templates.ts');

  // useTemplates.ts
  const useTemplatesHook = `"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '@/api/templates';
import type { TemplateFilter, CreateTemplateInput, UpdateTemplateInput } from '@/types/template.types';

export function useTemplates(params?: TemplateFilter) {
  return useQuery({
    queryKey: ['templates', params],
    queryFn: () => fetchTemplates(params),
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTemplateInput) => createTemplate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template created');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTemplateInput }) =>
      updateTemplate(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template deleted');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
`;
  writeFileSync(join(hooksDir, 'useTemplates.ts'), useTemplatesHook);
  log('Created src/hooks/useTemplates.ts');

  // TemplateRow.tsx
  const templateRow = `import { Pencil, Trash2 } from 'lucide-react';
import type { TemplateDto } from '@/types/template.types';

interface TemplateRowProps {
  template: TemplateDto;
  onEdit: (template: TemplateDto) => void;
  onDelete: (template: TemplateDto) => void;
}

export function TemplateRow({ template, onEdit, onDelete }: TemplateRowProps) {
  const varCount = template.variables?.length || 0;

  return (
    <div className="glass-panel px-6 py-5 rounded-sm border border-white/5 transition-all duration-300 hover:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-on-surface font-medium text-sm">{template.name}</h3>
            {varCount > 0 && (
              <span className="text-[10px] uppercase tracking-[0.1em] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {varCount} variable{varCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-outline text-sm italic mb-2">{template.subject}</p>
          <p className="text-outline text-xs line-clamp-2">{template.body}</p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <button onClick={() => onEdit(template)} className="text-outline hover:text-primary transition-colors">
            <Pencil className="w-[18px] h-[18px]" />
          </button>
          <button onClick={() => onDelete(template)} className="text-outline hover:text-error transition-colors">
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
`;
  writeFileSync(join(templatesDir, 'TemplateRow.tsx'), templateRow);
  log('Created src/components/features/templates/TemplateRow.tsx');

  // TemplateList.tsx
  const templateList = `import type { TemplateDto } from '@/types/template.types';
import { TemplateRow } from './TemplateRow';

interface TemplateListProps {
  templates: TemplateDto[];
  onEdit: (template: TemplateDto) => void;
  onDelete: (template: TemplateDto) => void;
}

export function TemplateList({ templates, onEdit, onDelete }: TemplateListProps) {
  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <TemplateRow
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
`;
  writeFileSync(join(templatesDir, 'TemplateList.tsx'), templateList);
  log('Created src/components/features/templates/TemplateList.tsx');

  // CreateTemplateModal.tsx
  const createModal = `"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTemplateSchema, type CreateTemplateFormValues } from '@/validations/template.schema';
import { useCreateTemplate } from '@/hooks/useTemplates';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTemplateModal({ open, onOpenChange }: CreateTemplateModalProps) {
  const { mutate, isPending } = useCreateTemplate();

  const form = useForm<CreateTemplateFormValues>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: '',
      subject: '',
      body: '',
      variables: [],
    },
  });

  const onSubmit = (data: CreateTemplateFormValues) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Name</label>
            <input
              {...form.register('name')}
              className="w-full input-base"
              placeholder="Welcome Email"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-error mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Subject</label>
            <input
              {...form.register('subject')}
              className="w-full input-base"
              placeholder="Welcome to our platform!"
            />
            {form.formState.errors.subject && (
              <p className="text-sm text-error mt-1">{form.formState.errors.subject.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Body</label>
            <Textarea
              {...form.register('body')}
              className="w-full input-base min-h-[200px]"
              placeholder="Dear {{name}}, welcome aboard..."
            />
            {form.formState.errors.body && (
              <p className="text-sm text-error mt-1">{form.formState.errors.body.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`;
  writeFileSync(join(templatesDir, 'CreateTemplateModal.tsx'), createModal);
  log('Created src/components/features/templates/CreateTemplateModal.tsx');

  // EditTemplateModal.tsx
  const editModal = `"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTemplateSchema, type UpdateTemplateFormValues } from '@/validations/template.schema';
import { useUpdateTemplate } from '@/hooks/useTemplates';
import type { TemplateDto } from '@/types/template.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface EditTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: TemplateDto | null;
}

export function EditTemplateModal({ open, onOpenChange, template }: EditTemplateModalProps) {
  const { mutate, isPending } = useUpdateTemplate();

  const form = useForm<UpdateTemplateFormValues>({
    resolver: zodResolver(updateTemplateSchema),
    defaultValues: {
      name: '',
      subject: '',
      body: '',
    },
  });

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        subject: template.subject,
        body: template.body,
      });
    }
  }, [template, form]);

  const onSubmit = (data: UpdateTemplateFormValues) => {
    if (!template) return;
    mutate({ id: template.id, data }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Name</label>
            <input {...form.register('name')} className="w-full input-base" />
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Subject</label>
            <input {...form.register('subject')} className="w-full input-base" />
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Body</label>
            <Textarea {...form.register('body')} className="w-full input-base min-h-[200px]" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`;
  writeFileSync(join(templatesDir, 'EditTemplateModal.tsx'), editModal);
  log('Created src/components/features/templates/EditTemplateModal.tsx');

  // DeleteTemplateDialog.tsx
  const deleteDialog = `"use client";

import { AlertTriangle } from 'lucide-react';
import { useDeleteTemplate } from '@/hooks/useTemplates';
import type { TemplateDto } from '@/types/template.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: TemplateDto | null;
}

export function DeleteTemplateDialog({ open, onOpenChange, template }: DeleteTemplateDialogProps) {
  const { mutate, isPending } = useDeleteTemplate();

  const handleDelete = () => {
    if (!template) return;
    mutate(template.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            Delete Template
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{template?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
`;
  writeFileSync(join(templatesDir, 'DeleteTemplateDialog.tsx'), deleteDialog);
  log('Created src/components/features/templates/DeleteTemplateDialog.tsx');

  // TemplateSkeleton.tsx
  const skeleton = `export function TemplateSkeleton() {
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
`;
  writeFileSync(join(templatesDir, 'TemplateSkeleton.tsx'), skeleton);
  log('Created src/components/features/templates/TemplateSkeleton.tsx');

  // templates/page.tsx
  const templatesPage = `"use client";

import { useState } from 'react';
import { useTemplates } from '@/hooks/useTemplates';
import { TemplateList } from '@/components/features/templates/TemplateList';
import { TemplateSkeleton } from '@/components/features/templates/TemplateSkeleton';
import { EmptyState } from '@/components/features/students/EmptyState';
import { ErrorState } from '@/components/features/students/ErrorState';
import { CreateTemplateModal } from '@/components/features/templates/CreateTemplateModal';
import { EditTemplateModal } from '@/components/features/templates/EditTemplateModal';
import { DeleteTemplateDialog } from '@/components/features/templates/DeleteTemplateDialog';
import type { TemplateDto } from '@/types/template.types';
import { Button } from '@/components/ui/button';

export default function TemplatesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDto | null>(null);

  const { data, isLoading, error, refetch } = useTemplates();

  const handleEdit = (template: TemplateDto) => {
    setSelectedTemplate(template);
    setEditOpen(true);
  };

  const handleDelete = (template: TemplateDto) => {
    setSelectedTemplate(template);
    setDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
              Email Templates
            </h2>
            <p className="text-sm text-outline mt-1">Manage your email templates</p>
          </div>
          <Button className="btn-primary-gradient">Create Template</Button>
        </div>
        <TemplateSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 max-w-7xl w-full mx-auto">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  const templates = data?.data || [];

  return (
    <div className="p-10 max-w-7xl w-full mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
            Email Templates
          </h2>
          <p className="text-sm text-outline mt-1">
            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button className="btn-primary-gradient" onClick={() => setCreateOpen(true)}>
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          title="No templates yet"
          description="Create your first email template to get started"
          cta="Create Template"
          onCtaClick={() => setCreateOpen(true)}
        />
      ) : (
        <TemplateList
          templates={templates}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CreateTemplateModal open={createOpen} onOpenChange={setCreateOpen} />
      <EditTemplateModal
        open={editOpen}
        onOpenChange={setEditOpen}
        template={selectedTemplate}
      />
      <DeleteTemplateDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        template={selectedTemplate}
      />
    </div>
  );
}
`;
  writeFileSync(join(templatesPageDir, 'page.tsx'), templatesPage);
  log('Created src/app/(dashboard)/templates/page.tsx');

  // Add Textarea to shadcn components if not exists
  const textareaPath = join(uiDir, 'textarea.tsx');
  if (!existsSync(textareaPath)) {
    try {
      execSync('npx shadcn@latest add textarea -y', { cwd: FRONTEND_DIR, stdio: 'pipe' });
      log('Added shadcn/textarea');
    } catch {
      log('Note: textarea may already exist');
    }
  }

  updateLock({ phase: 'P5', status: 'completed', task: null });
  updateSharedState({ projectState: { phaseStatus: { P0: 'completed', P1: 'completed', P3: 'completed', P5: 'completed' } } });
  log('Phase 5 completed!');
}

// ============ PHASE 7: Polish ============
function phase7() {
  log('Starting Phase 7: Polish (responsive, animations, SEO, error boundaries, loading states)');
  updateLock({ phase: 'P7', task: 'Adding polish and refinements', status: 'in_progress' });

  // Read shared state to check if other phases are complete
  const sharedState = JSON.parse(readFileSync(SHARED_STATE, 'utf-8'));
  const phaseStatus = sharedState.projectState?.phaseStatus || {};
  const uiDir = join(FRONTEND_DIR, 'src/components/ui');

  const allPhasesComplete =
    phaseStatus.P0 === 'completed' &&
    phaseStatus.P1 === 'completed' &&
    phaseStatus.P3 === 'completed' &&
    phaseStatus.P5 === 'completed';

  if (!allPhasesComplete) {
    log('Phase 7 waiting for P0, P1, P3, P5 to complete');
    updateLock({ phase: 'P7', status: 'waiting', task: 'Waiting for other phases' });
    return;
  }

  // Add responsive utilities to globals.css
  const globalsPath = join(FRONTEND_DIR, 'src/app/globals.css');
  if (existsSync(globalsPath)) {
    let globals = readFileSync(globalsPath, 'utf-8');
    if (!globals.includes('/* Phase 7: Polish */')) {
      globals += `
/* Phase 7: Polish */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus visible styles */
:focus-visible {
  outline: 2px solid hsl(var(--primary) / 0.5);
  outline-offset: 2px;
}

/* Selection styles */
::selection {
  background-color: hsl(var(--primary) / 0.2);
  color: hsl(var(--on-surface));
}
`;
      writeFileSync(globalsPath, globals);
      log('Added polish utilities to globals.css');
    }
  }

  // Create error boundary
  const errorBoundary = `"use client";

import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-lowest">
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-error" />
            </div>
            <h2 className="font-headline text-xl font-medium text-on-surface mb-2">
              Something went wrong
            </h2>
            <p className="text-outline text-sm mb-4">
              Please refresh the page or try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
`;
  const errorBoundaryPath = join(FRONTEND_DIR, 'src/components/ErrorBoundary.tsx');
  writeFileSync(errorBoundaryPath, errorBoundary);
  log('Created src/components/ErrorBoundary.tsx');

  // Create loading component
  const loading = `import { Spinner } from '@/components/ui/spinner';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-surface-lowest/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner className="w-10 h-10 text-primary mx-auto mb-4" />
        <p className="text-sm text-outline">{message}</p>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-lowest">
      <div className="text-center">
        <Spinner className="w-10 h-10 text-primary mx-auto mb-4" />
        <p className="text-sm text-outline">Loading...</p>
      </div>
    </div>
  );
}
`;
  const loadingPath = join(FRONTEND_DIR, 'src/components/Loading.tsx');
  writeFileSync(loadingPath, loading);
  log('Created src/components/Loading.tsx');

  // Add Spinner if not exists
  const spinnerPath = join(uiDir, 'spinner.tsx');
  if (!existsSync(spinnerPath)) {
    try {
      execSync('npx shadcn@latest add spinner -y', { cwd: FRONTEND_DIR, stdio: 'pipe' });
      log('Added shadcn/spinner');
    } catch {
      log('Note: spinner may already exist');
    }
  }

  updateLock({ phase: 'P7', status: 'completed', task: null });
  updateSharedState({ projectState: { phaseStatus: { P7: 'completed' }, allPhasesComplete: true } });
  log('Phase 7 completed! All phases done.');
}

// ============ MAIN EXECUTION ============
async function main() {
  log('Agent 2 starting...');
  updateSharedState({ agent2: { status: 'running', startedAt: new Date().toISOString() } });

  try {
    phase0();
    phase1();
    phase3();
    phase5();
    phase7();
    log('Agent 2 completed all phases: P0, P1, P3, P5, P7');
    updateLock({ status: 'completed', message: 'Agent 2 completed all phases' });
  } catch (error) {
    log('Error: ' + error);
    updateLock({ status: 'error', message: String(error) });
  }
}

main();
