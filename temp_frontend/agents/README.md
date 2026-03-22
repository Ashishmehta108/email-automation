# Agent Lock File System

This directory contains lock files for coordinating parallel agent execution.

## Lock Files

- `agent1.lock` - Agent 1's current task/phase
- `agent2.lock` - Agent 2's current task/phase
- `shared-state.json` - Shared state for coordination

## Usage

Each agent writes to its own lock file to signal what it's working on.
Before starting a new phase, agents check:
1. Their assigned phases
2. Dependencies from other phases
3. Shared state for any conflicts

## Parallel Execution Model

```
Agent 1: Phase 0 → Phase 1 → Phase 2 → Phase 4 → Phase 6
Agent 2: Phase 0 → Phase 1 → Phase 3 → Phase 5 → Phase 7
```

Both agents work on Phase 0 and Phase 1 together (scaffold + auth/layout).
Then they split:
- Agent 1: Dashboard + Certificates + Settings
- Agent 2: Students + Templates + Polish
