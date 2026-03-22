# Parallel Agent Execution Scripts

## Overview

Two agents work in parallel on the Email Automation frontend project.

## Agent Assignments

### Agent 1 (Infrastructure + Core Features)
- **P0**: Project scaffold, dependencies, Tailwind config, utils, fonts its done
- **P1**: Auth client, Query client, API layer, Root layout, Home redirect, Types
- **P2**: Dashboard page (stats, recent operations, status breakdown)
- **P4**: Certificates module (types, API, hooks, components, page)
- **P6**: Settings page (profile, password, sign-out)

### Agent 2 (Auth UI + Feature Modules)
- **P0**: shadcn init, shadcn components, env file shadcn done 
- **P1**: Auth validations, Login page, Register page, Auth layout, Sidebar, Topbar, Shell, Dashboard layout
- **P3**: Students module (types, validations, API, hooks, components, page)
- **P5**: Templates module (types, validations, API, hooks, components, page)
- **P7**: Polish, responsive, animations, SEO, error boundaries

## Lock File Protocol

1. Before starting work, agent reads `shared-state.json`
2. Agent writes to its own `.lock` file with current task
3. Agent updates `shared-state.json` with progress
4. On completion, agent marks phase as "completed" and clears lock

## Running Agents

Execute both agents simultaneously in separate terminals:

```bash
# Terminal 1 - Agent 1
node agents/run-agent1.mjs

# Terminal 2 - Agent 2  
node agents/run-agent2.mjs
```

## Phase Dependencies

```
P0 (Scaffold) → P1 (Auth/Layout) → P2-P7 (Features)
                    ↓
        P2 (Dashboard) can start
        P3 (Students) can start
        P4 (Certificates) can start
        P5 (Templates) can start
        P6 (Settings) can start
        P7 (Polish) waits for all
```

## Conflict Resolution

- Both agents can work on P0 and P1 simultaneously (different files)
- P0 split: Agent 1 does config files, Agent 2 does shadcn setup
- P1 split: Agent 1 does core libs, Agent 2 does UI components
- P2-P6 are independent, can run in parallel
- P7 requires P2-P6 completion
