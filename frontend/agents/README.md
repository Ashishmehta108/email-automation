# Parallel Agent Execution System

## Overview

Two agents work 100% in parallel on the Email Automation frontend project.
Each agent writes to its lock file to signal current task to the other agent.

## Lock Files

- `agent1.lock` - Agent 1's current task/phase (JSON format)
- `agent2.lock` - Agent 2's current task/phase (JSON format)
- `shared-state.json` - Global project state and coordination

## Agent Assignments

### Agent 1 (Infrastructure + Dashboard + Certificates + Settings)
| Phase | Tasks | Files |
|-------|-------|-------|
| P0 | Tailwind config, globals.css, utils.ts, fonts.ts | tailwind.config.ts, src/app/globals.css, src/lib/utils.ts, src/lib/fonts.ts |
| P1 | auth-client.ts, query-client.ts, api.ts, layout.tsx, page.tsx, common.types.ts | src/lib/*, src/app/layout.tsx, src/app/page.tsx, src/types/common.types.ts |
| P2 | Dashboard page, StatCard, StatsGrid, RecentOperations, StatusBreakdown | src/app/(dashboard)/dashboard/*, src/components/features/dashboard/* |
| P4 | Certificates module (types, API, hooks, components, page) | src/types/certificate.types.ts, src/api/certificates.ts, src/hooks/useCertificates.ts, src/components/features/certificates/* |
| P6 | Settings page (profile, password, sign-out) | src/app/(dashboard)/settings/*, src/components/features/settings/* |

### Agent 2 (Dependencies + Auth UI + Students + Templates + Polish)
| Phase | Tasks | Files |
|-------|-------|-------|
| P0 | Install deps, shadcn components, .env.local | package.json, src/components/ui/*, .env.local |
| P1 | auth.types.ts, auth.schema.ts, auth pages, Sidebar, Topbar, Shell | src/types/auth.types.ts, src/validations/auth.schema.ts, src/app/(auth)/*, src/components/layout/* |
| P3 | Students module (types, validations, API, hooks, components, page) | src/types/student.types.ts, src/validations/student.schema.ts, src/api/students.ts, src/hooks/useStudents.ts, src/components/features/students/* |
| P5 | Templates module (types, validations, API, hooks, components, page) | src/types/template.types.ts, src/validations/template.schema.ts, src/api/templates.ts, src/hooks/useTemplates.ts, src/components/features/templates/* |
| P7 | Responsive, animations, SEO, error boundaries, loading states | Various polish files |

## Coordination Protocol

1. **Before starting work:**
   - Read `shared-state.json` to check phase status
   - Read other agent's `.lock` file to see what they're doing
   - Write to your own `.lock` file with current task

2. **During work:**
   - Update `.lock` file with progress
   - Mark files as "in_progress" in shared-state.json

3. **After completion:**
   - Mark phase as "completed" in shared-state.json
   - Clear your `.lock` file status

## Phase Dependencies

```
P0 (both agents) → P1 (both agents) → P2-P6 (parallel) → P7 (Agent 2 waits)
```

- P0 and P1: Both agents work simultaneously (different files)
- P2, P3, P4, P5, P6: Can run 100% in parallel (independent modules)
- P7: Agent 2 waits for P2-P6 completion

## Running Agents

Execute both agents simultaneously:

```bash
# Terminal 1 - Agent 1
node agents/run-agent1.mjs

# Terminal 2 - Agent 2
node agents/run-agent2.mjs
```

## File Conflicts to Avoid

| Agent 1 Works On | Agent 2 Works On |
|-----------------|------------------|
| src/lib/auth-client.ts | src/types/auth.types.ts |
| src/lib/query-client.ts | src/validations/auth.schema.ts |
| src/api/api.ts | src/app/(auth)/login/page.tsx |
| src/app/layout.tsx | src/app/(auth)/register/page.tsx |
| src/types/common.types.ts | src/components/layout/Sidebar.tsx |
| src/components/features/dashboard/* | src/components/layout/Topbar.tsx |
| src/components/features/certificates/* | src/components/layout/Shell.tsx |
| src/components/features/settings/* | src/components/features/students/* |
| | src/components/features/templates/* |

No file conflicts - 100% parallel execution possible!
