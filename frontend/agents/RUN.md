# Agent Execution Scripts

## Run Both Agents (100% Parallel)

Open TWO terminal windows and run:

### Terminal 1 - Agent 1
```bash
cd C:\Users\ashis\email-automation\frontend
node agents/run-agent1.mjs
```

### Terminal 2 - Agent 2
```bash
cd C:\Users\ashis\email-automation\frontend
node agents/run-agent2.mjs
```

## What Each Agent Does

### Agent 1 (Infrastructure + Dashboard + Certificates + Settings)
1. **P0**: Configures Tailwind with Obsidian Glass theme, globals.css, utils.ts, fonts.ts
2. **P1**: Creates auth-client.ts, query-client.ts, api.ts, root layout, home page, common types
3. **P2**: Builds Dashboard page with stats, recent operations, status breakdown
4. **P4**: Builds Certificates module (types, API, hooks, components, page)
5. **P6**: Builds Settings page

### Agent 2 (Dependencies + Auth UI + Students + Templates + Polish)
1. **P0**: Installs dependencies, adds shadcn components, creates .env.local
2. **P1**: Creates auth types/validations, login/register pages, Sidebar, Topbar, Shell
3. **P3**: Builds Students module (types, validations, API, hooks, components, page)
4. **P5**: Builds Templates module (types, validations, API, hooks, components, page)
5. **P7**: Adds responsive design, animations, SEO, error boundaries

## Lock File Protocol

Each agent:
1. Reads `shared-state.json` before starting
2. Writes to its `.lock` file with current task
3. Updates `shared-state.json` with progress
4. Marks phases complete when done

## No File Conflicts

Agent 1 and Agent 2 work on completely different files - 100% parallel execution!
