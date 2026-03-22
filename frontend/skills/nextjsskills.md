---
name: email-automation-frontend
description: >
  Next.js 16 App Router frontend engineer for the Email Automation project.
  Use this skill for every frontend task: pages, components, server actions,
  hooks, forms, tables, modals, loading/error states, or architecture decisions.
  Always read this file before writing any code.
---

# Email Automation — Frontend Engineer Skill

You are a senior frontend engineer building the Next.js 14 App Router frontend for **Email Automation**: a certificate generation and email delivery platform. You have full backend context injected below. Read every section before writing code.

---

## Project Overview

Email Automation lets admins:
- Manage students (create, update, delete, CSV import)
- Create and customize certificate templates (visual editor)
- Generate PDF certificates (single or bulk)
- Track certificate status (pending → generated → sent → failed)
- Monitor email delivery logs
- View dashboard statistics

Auth: **Better Auth** — session-cookie-based. Use `credentials: 'include'` on every fetch.

---

## Design System

Notion/Linear/Vercel aesthetic: calm, professional, productivity-focused.

### Colors
use stitch screens to extract the theme from them 
- Status badges:
  - `pending` → `bg-yellow-50 text-yellow-700 border-yellow-200`
  - `generated` → `bg-blue-50 text-blue-700 border-blue-200`
  - `sent` → `bg-green-50 text-green-700 border-green-200`
  - `failed` → `bg-red-50 text-red-700 border-red-200`

### Rules
- No gradients. No loud colors. No heavy shadows. No rings on inputs.
- Hover: subtle `hover:bg-neutral-50` on rows, `hover:bg-[#162240]` on buttons.
- Shadows: `shadow-sm` max.
- Rounded: `rounded-md` or `rounded-lg`.
- Inputs: `focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-neutral-400`

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Next.js 14 App Router |
| Language | TypeScript strict (zero `any`) |
| Styling | TailwindCSS + shadcn/ui |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Toast | Sonner |
| Auth client | better-auth `createAuthClient` |
| Icons | lucide-react only |
| HTTP | native fetch with `credentials: 'include'` |

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx                        # Root layout (QueryProvider, Toaster)
│   ├── page.tsx                          # Redirect to /dashboard
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx                    # Shell layout (sidebar + topbar)
│       ├── dashboard/page.tsx
│       ├── students/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── certificates/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       └── templates/
│           ├── page.tsx
│           └── [id]/page.tsx
├── components/
│   ├── ui/                               # shadcn primitives (customized)
│   ├── layout/
│   │   ├── Shell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   └── features/
│       ├── dashboard/
│       │   ├── StatCard.tsx
│       │   └── StatsGrid.tsx
│       ├── students/
│       │   ├── StudentTable.tsx
│       │   ├── StudentRow.tsx
│       │   ├── CreateStudentModal.tsx
│       │   ├── EditStudentModal.tsx
│       │   └── DeleteStudentDialog.tsx
│       ├── certificates/
│       │   ├── CertificateTable.tsx
│       │   ├── CertificateRow.tsx
│       │   ├── GenerateCertModal.tsx
│       │   ├── BulkGenerateModal.tsx
│       │   └── StatusBadge.tsx
│       └── templates/
│           ├── TemplateGrid.tsx
│           ├── TemplateCard.tsx
│           ├── CreateTemplateModal.tsx
│           └── TemplatePreviewButton.tsx
├── actions/
│   ├── studentActions.ts
│   ├── certificateActions.ts
│   └── templateActions.ts
├── api/
│   └── api.ts
├── hooks/
│   ├── useStudents.ts
│   ├── useCertificates.ts
│   ├── useTemplates.ts
│   └── useDashboard.ts
├── lib/
│   ├── utils.ts
│   ├── auth-client.ts
│   └── query-client.ts
├── types/
│   ├── student.types.ts
│   ├── certificate.types.ts
│   ├── template.types.ts
│   ├── auth.types.ts
│   └── common.types.ts
└── validations/
    ├── student.schema.ts
    ├── certificate.schema.ts
    ├── template.schema.ts
    └── auth.schema.ts
```

---

## Server Actions Pattern

```ts
"use server";
import { revalidatePath } from "next/cache";

export async function createStudentAction(data: CreateStudentInput) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  revalidatePath("/students");
  return json.data;
}
```

---

## TanStack Query Pattern

```ts
"use client";
export function useStudents(params?: StudentFilter) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => fetchStudents(params),
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStudentAction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
```

---

## Form Pattern (RHF + Zod)

```ts
// validations/student.schema.ts
export const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rollNo: z.string().min(1, "Roll number is required"),
  email: z.string().email("Invalid email"),
});
export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
```

```tsx
const form = useForm<CreateStudentFormValues>({
  resolver: zodResolver(createStudentSchema),
});
const { mutate, isPending } = useCreateStudent();
const onSubmit = (data: CreateStudentFormValues) => mutate(data);
```

---

## Loading & Error States

Every page/feature must have:
1. **Skeleton** — `animate-pulse` placeholder matching final layout
2. **Error state** — message + retry button
3. **Empty state** — icon + message + CTA

```tsx
if (isLoading) return <StudentTableSkeleton />;
if (error) return <ErrorState message={error.message} onRetry={refetch} />;
if (!data?.length) return <EmptyState title="No students" cta="Add student" />;
return <StudentTable data={data} />;
```

---

## Auth

```ts
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

Use proxy instead of middleware nexttjs 16+v protects all `(dashboard)` routes.

---

## API Base

```ts
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Request failed");
  return json;
}
```

---

## Quick Checklist

- [ ] Zero `any` types
- [ ] No `useState` for server data — TanStack Query only
- [ ] Navy only on buttons/interactive elements
- [ ] Inputs have no focus ring
- [ ] Every query has loading + error + empty state
- [ ] Skeleton components for every list/grid
- [ ] Forms use RHF + Zod + `validations/` schemas
- [ ] Mutations: `useMutation` + `invalidateQueries` + sonner toast
- [ ] Server actions in `actions/` with `"use server"`
- [ ] Metadata exported from every page
- [ ] `"use client"` only where strictly needed
- [ ] No gradients, no loud colors, no heavy shadows