# Email Automation — Frontend Implementation Plan

> **Design System:** "The Precision Layer" — Obsidian Glass dark theme  
> **Framework:** Next.js 14, App Router, TypeScript strict  
> **UI:** Tailwind CSS + shadcn/ui (dark-customized)  
> **State:** TanStack Query v5 + React Hook Form + Zod  
> **Auth:** Better Auth (session cookies)

---

## Phase 0 — Project Scaffolding & Design Tokens

> **Goal:** Initialize Next.js, install all deps, configure Tailwind with the Obsidian Glass palette, and wire up shadcn/ui.

### Tasks

| # | Task | Files Created / Modified |
|---|------|--------------------------|
| 0.1 | Scaffold Next.js 14 App Router with TypeScript (`npx -y create-next-app@latest ./`) | `/frontend/` root |
| 0.2 | Install runtime dependencies: `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`, `better-auth`, `sonner`, `lucide-react` | `package.json` |
| 0.3 | Init shadcn/ui (`npx -y shadcn@latest init`) — select "New York" style, dark mode, and custom CSS variables | `components.json`, `tailwind.config.ts`, `globals.css` |
| 0.4 | Add shadcn components: `button`, `input`, `dialog`, `dropdown-menu`, `table`, `badge`, `skeleton`, `card`, `select`, `label`, `form`, `tooltip`, `popover`, `separator` | `src/components/ui/*` |
| 0.5 | Configure **Obsidian Glass** design tokens in `tailwind.config.ts` and `globals.css` — surface tiers, typography (Space Grotesk + Inter via Google Fonts), ghost borders, glassmorphism utilities | `tailwind.config.ts`, `globals.css` |
| 0.6 | Create `src/lib/utils.ts` — `cn()` helper, status color map, date formatters | `src/lib/utils.ts` |
| 0.7 | Create `src/lib/fonts.ts` — configure Google Font loaders for **Space Grotesk** (headlines) and **Inter** (body) | `src/lib/fonts.ts` |

### Design Token Reference (from DESIGN.md)

```
Surface Hierarchy:
  --surface-lowest:    #0e0e0e   (background foundation)
  --surface-low:       #161616   (sidebar)
  --surface:           #1a1a1a   (main content)
  --surface-container: #201f1f   (cards, primary zones)
  --surface-high:      #2a2a29   (elevated cards)
  --surface-highest:   #353534   (active/interactive)
  --surface-bright:    #3f3f3e   (selection highlight)

Text:
  --on-surface:        #e5e2e1   (primary text — never pure white)
  --on-surface-muted:  #9a9a98   (secondary text)

Primary:
  --primary:           #acc7ff   (accent blue — sparingly)
  --primary-container: #508ff8   (CTA gradient end)

Borders:
  --outline-variant:   #424753   (ghost borders at 20% opacity)
  --ghost-border:      rgba(66, 71, 83, 0.2)

Glassmorphism:
  backdrop-blur: 24-32px, surface at 60% opacity

Typography:
  Headlines: Space Grotesk, weight 300, tracking -0.02em
  Stats/Numbers: Space Grotesk, tracking +0.05em
  Body: Inter, weight 400-500, tracking +0.01em to +0.02em
  Labels: Inter, weight 500 (label-md)

Roundness:
  Structural (cards/inputs): rounded-sm (0.125rem) or rounded-none
  Chips/badges: rounded-full
  Buttons: rounded-sm

Shadows: 
  Ghost Shadow -> blur 40px, spread 0, 8% opacity on-surface
  Never heavy drop shadows
```

---

## Phase 1 — Auth & Core Layout

> **Goal:** Login/register pages, root layout with providers, and the dashboard shell (sidebar + topbar).

### Tasks

| # | Task | Files |
|---|------|-------|
| 1.1 | Create `src/lib/auth-client.ts` — Better Auth client with `createAuthClient({ baseURL })` | `src/lib/auth-client.ts` |
| 1.2 | Create `src/lib/query-client.ts` — TanStack QueryClient singleton + `QueryProvider` wrapper component | `src/lib/query-client.ts` |
| 1.3 | Create `src/api/api.ts` — generic `apiFetch<T>()` with `credentials: 'include'`, error extraction, typed returns | `src/api/api.ts` |
| 1.4 | Create **Root Layout** — `src/app/layout.tsx` with `<QueryProvider>`, `<Toaster>`, font classes, dark `<html>` | `src/app/layout.tsx` |
| 1.5 | Create `src/app/page.tsx` — redirect to `/dashboard` | `src/app/page.tsx` |
| 1.6 | Create **Auth Types** — `src/types/auth.types.ts` (User, Session, AuthResponse) | `src/types/auth.types.ts` |
| 1.7 | Create **Auth Validation** — `src/validations/auth.schema.ts` (loginSchema, registerSchema) | `src/validations/auth.schema.ts` |
| 1.8 | Create **Login Page** — `src/app/(auth)/login/page.tsx` — centered card, email + password form, RHF + Zod, Better Auth sign-in, redirect on success | `src/app/(auth)/login/page.tsx` |
| 1.9 | Create **Register Page** — `src/app/(auth)/register/page.tsx` — same pattern, name + email + password, sign-up flow | `src/app/(auth)/register/page.tsx` |
| 1.10 | Create **Auth Layout** — `src/app/(auth)/layout.tsx` — centered container, no sidebar, Obsidian Glass background | `src/app/(auth)/layout.tsx` |
| 1.11 | Create **Sidebar** — `src/components/layout/Sidebar.tsx` — fixed left, tonal stepping (`surface-low`), nav items: Dashboard, Students, Certificates, Settings, active state with 2px left primary accent, user card at bottom | `src/components/layout/Sidebar.tsx` |
| 1.12 | Create **Topbar** — `src/components/layout/Topbar.tsx` — search input, notification bell icon, help icon, "Admin Console" with avatar | `src/components/layout/Topbar.tsx` |
| 1.13 | Create **Shell** — `src/components/layout/Shell.tsx` — sidebar + topbar + `{children}` main area, responsive: sidebar collapses to bottom navbar on mobile | `src/components/layout/Shell.tsx` |
| 1.14 | Create **Dashboard Layout** — `src/app/(dashboard)/layout.tsx` — wraps `<Shell>`, auth guard (redirect to `/login` if no session) | `src/app/(dashboard)/layout.tsx` |

---

## Phase 2 — Dashboard Page

> **Goal:** System overview with live stats, recent operations list, and status health donut.

### Tasks

| # | Task | Files |
|---|------|-------|
| 2.1 | Create **Common Types** — `src/types/common.types.ts` (ApiResponse, PaginatedResponse, StatsData) | `src/types/common.types.ts` |
| 2.2 | Create **Stats Hook** — `src/hooks/useDashboard.ts` — `useStats()` query calling `GET /api/stats` | `src/hooks/useDashboard.ts` |
| 2.3 | Create **StatCard** — `src/components/features/dashboard/StatCard.tsx` — icon, label (uppercase tracking), large number (Space Grotesk), subtitle | `src/components/features/dashboard/StatCard.tsx` |
| 2.4 | Create **StatsGrid** — `src/components/features/dashboard/StatsGrid.tsx` — 4 cards in a row: Total Students, Certificates, Emails Sent, Failed | `src/components/features/dashboard/StatsGrid.tsx` |
| 2.5 | Create **RecentOperations** — `src/components/features/dashboard/RecentOperations.tsx` — list of recent certificate operations with status badges, "View Logs" button | `src/components/features/dashboard/RecentOperations.tsx` |
| 2.6 | Create **StatusBreakdown** — `src/components/features/dashboard/StatusBreakdown.tsx` — donut chart (CSS-based or lightweight canvas), health %, legend items | `src/components/features/dashboard/StatusBreakdown.tsx` |
| 2.7 | Create **Dashboard Page** — `src/app/(dashboard)/dashboard/page.tsx` — page header ("System Overview"), StatsGrid, two-column layout with RecentOperations + StatusBreakdown | `src/app/(dashboard)/dashboard/page.tsx` |
| 2.8 | Create **DashboardSkeleton** — skeleton loading state matching final layout | `src/components/features/dashboard/DashboardSkeleton.tsx` |

---

## Phase 3 — Students Module

> **Goal:** Full CRUD for students with search, pagination, modals.

### Tasks

| # | Task | Files |
|---|------|-------|
| 3.1 | Create **Student Types** — `src/types/student.types.ts` | `src/types/student.types.ts` |
| 3.2 | Create **Student Validations** — `src/validations/student.schema.ts` | `src/validations/student.schema.ts` |
| 3.3 | Create **Student API functions** — `src/api/students.ts` | `src/api/students.ts` |
| 3.4 | Create **Student Hooks** — `src/hooks/useStudents.ts` | `src/hooks/useStudents.ts` |
| 3.5 | Create **StudentRow** — `src/components/features/students/StudentRow.tsx` | `StudentRow.tsx` |
| 3.6 | Create **StudentTable** — `src/components/features/students/StudentTable.tsx` | `StudentTable.tsx` |
| 3.7 | Create **CreateStudentModal** — `src/components/features/students/CreateStudentModal.tsx` | `CreateStudentModal.tsx` |
| 3.8 | Create **EditStudentModal** — `src/components/features/students/EditStudentModal.tsx` | `EditStudentModal.tsx` |
| 3.9 | Create **DeleteStudentDialog** — `src/components/features/students/DeleteStudentDialog.tsx` | `DeleteStudentDialog.tsx` |
| 3.10 | Create **Pagination** — `src/components/ui/Pagination.tsx` | `Pagination.tsx` |
| 3.11 | Create **Students Page** — `src/app/(dashboard)/students/page.tsx` | `students/page.tsx` |
| 3.12 | Create **StudentTableSkeleton** + **EmptyState** + **ErrorState** | shared UI components |

---

## Phase 4 — Certificates Module

> **Goal:** Certificate generation (single + bulk), listing with filters, status management.

### Tasks

| # | Task | Files |
|---|------|-------|
| 4.1 | Create **Certificate Types** — `src/types/certificate.types.ts` | `certificate.types.ts` |
| 4.2 | Create **Certificate Validations** — `src/validations/certificate.schema.ts` | `certificate.schema.ts` |
| 4.3 | Create **Certificate API + Hooks** — `src/api/certificates.ts`, `src/hooks/useCertificates.ts` | API + hooks |
| 4.4 | Create **StatusBadge** — pill-shaped status indicator | `StatusBadge.tsx` |
| 4.5 | Create **GenerateCertForm** — inline generation form | `GenerateCertForm.tsx` |
| 4.6 | Create **BulkGenerateModal** — multi-student bulk generation | `BulkGenerateModal.tsx` |
| 4.7 | Create **CertificateTable + Row** | `CertificateTable.tsx`, `CertificateRow.tsx` |
| 4.8 | Create **Certificates Page** — `src/app/(dashboard)/certificates/page.tsx` | `certificates/page.tsx` |

---

## Phase 5 — Certificate Templates Module

> **Goal:** Template CRUD, visual customization, PDF preview.

### Tasks

| # | Task | Files |
|---|------|-------|
| 5.1 | Create **Template Types + Validations** | types + schema files |
| 5.2 | Create **Template API + Hooks** | API + hooks |
| 5.3 | Create **TemplateCard + Grid** — responsive card grid | component files |
| 5.4 | Create **CreateTemplateModal** — multi-section visual editor | `CreateTemplateModal.tsx` |
| 5.5 | Create **TemplatePreviewButton** — blob-based PDF preview | `TemplatePreviewButton.tsx` |
| 5.6 | Create **Templates Page** | `templates/page.tsx` |

---

## Phase 6 — Settings Page

| # | Task | Files |
|---|------|-------|
| 6.1 | Create **Settings Page** — profile, password, sign-out | `settings/page.tsx` |
| 6.2 | Create **ProfileForm** | `ProfileForm.tsx` |

---

## Phase 7 — Polish & Responsive

| # | Task |
|---|------|
| 7.1 | Mobile bottom navigation |
| 7.2 | Mobile card layouts for students/certificates |
| 7.3 | Dashboard mobile 2x2 grid |
| 7.4 | Transitions & micro-animations |
| 7.5 | Sonner toast theming |
| 7.6 | Glassmorphism modals |
| 7.7 | SEO metadata on every page |
| 7.8 | Global error boundary |
| 7.9 | Custom 404 page |
| 7.10 | Route-level loading.tsx skeletons |

---

## Recommended Execution: `P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7`

---

## Key Design Rules

1. **No pure white** — Use `#e5e2e1` for text
2. **No solid borders** — Ghost borders only (20% opacity)
3. **No heavy shadows** — Ghost shadows (8% opacity, 40px blur)
4. **No rounded-lg on cards/inputs** — Use `rounded-sm`
5. **No horizontal dividers** — Use spacing (1.4rem gap)
6. **Primary blue sparingly** — CTAs and active states only
7. **CTA gradient** — 135 deg from `#acc7ff` to `#508ff8`
8. **Glassmorphism modals** — 60% opacity + 24-32px blur
9. **Typography** — Space Grotesk headlines, Inter body
10. **`credentials: 'include'`** — Every fetch call
