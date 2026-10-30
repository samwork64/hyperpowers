---
name: managing-agent-docs
description: Maintain living architectural memory in agent-docs/ and manage the active ideas backlog. Use to initialize codebase maps, audit doc drift, or reconcile ideas.
---

# Managing Agent-Docs & Ideas Backlog

## Overview

`agent-docs/` maintains persistent, machine-optimized architectural context for coding agents across sessions, compactions, and branches. It eliminates cold-start file exploration and tracks creative ideas without polluting human documentation directories.

```
THIN ARCHITECTURE MAP ➔ SUBSYSTEM TOPOLOGY ➔ COMMIT SHA DRIFT GUARD ➔ LEAN IDEAS BACKLOG
```

---

## 1. When to Use This Skill

Invoke `hyperpowers:managing-agent-docs` when:
* **Cold-Starting an Existing Codebase**: Creating the initial `agent-docs/architecture.md` summary (in <60 seconds).
* **Auditing Documentation Drift**: Checking whether `agent-docs/modules/` match current git HEAD.
* **Managing Ideas Backlog**: Reviewing, adding, or pruning active concepts in `agent-docs/ideas.md`.
* **Pruning Stale Docs**: Cleaning up retired subsystem briefs or consolidating overlapping domains.

---

## 2. The 2-Tier Knowledge Hierarchy

To ensure cross-agent continuity without polluting turn-0 context windows, Hyperpowers organizes knowledge into two strict tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│               TIER 1: Root Instruction Anchor (<60 Lines)               │
│               (CLAUDE.md / AGENTS.md / rules/AGENTS.md)                │
├────────────────────────────────────────────────────────────────────────┤
│ • Injected into EVERY session at Turn 0                                │
│ • Strictly: Primary build/test commands + Non-negotiable repo bans     │
│ • Zero verbose explanations. Pointers to Tier 2 docs.                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Pointers (Loaded Just-in-Time)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               TIER 2: Living Subsystem Topology (JIT)                  │
│                     (agent-docs/modules/*.md)                          │
├────────────────────────────────────────────────────────────────────────┤
│ • Loaded ONLY when an agent actually touches that specific domain      │
│ • Auth gotchas in `auth.md`, Stripe webhooks in `billing.md`           │
│ • ZERO prompt token overhead when working on unrelated files!          │
└────────────────────────────────────────────────────────────────────────┘
```

### Strict Admission Gate for Tier 1 Root Files (`CLAUDE.md` / `AGENTS.md`)
Because root instruction files consume context tokens on **every single prompt turn across every conversation**, agents are strictly prohibited from writing to them except under 3 explicit conditions:
1. **Toolchain / Command Shift**: Build, test, lint, or run commands change (e.g. migrating to `pnpm`, or adding mandatory flags like `pytest -m "not e2e"`).
2. **Architectural Hard Ban / Invariant**: A recurring failure mode or hard constraint is established (e.g. *"Never delete Postgres enum columns; deprecate only"* or *"All touch targets must be $\ge 44\times 44$px"*).
3. **Direct User Convention Order**: The user explicitly corrects a habit or orders a permanent preference (*"Always use kebab-case for CSS variables"*).

#### Strictly Banned from Tier 1 Root Files:
- ❌ Task logs, feature changelogs, or development history.
- ❌ Code snippets, function implementations, or class definitions.
- ❌ Backlog ideas or pending tasks (use `agent-docs/ideas.md`).
- ❌ Module-specific trivia or subsystem details (use `agent-docs/modules/<subsystem>.md`).
- ❌ Any file exceeding **60 lines** (must be pruned or moved to Tier 2).

---

## 3. Directory Layout & Standards

```
<project-root>/
├── CLAUDE.md / AGENTS.md     # [Tier 1 Root Anchor] Commands, hard bans, doc pointers (<60 lines)
└── agent-docs/               # [Tier 2 Deep Architecture]
    ├── architecture.md       # Global tech stack, directory boundaries, entry points (~50 lines)
    ├── ideas.md              # Active backlog (auto-reconciled on branch completion)
    └── modules/              # Living subsystem briefs (30–50 lines each, read JIT)
        ├── auth.md           # Auth flows, session storage, middleware gotchas, verified commit SHA
        ├── billing.md        # Stripe/payment flows, webhook handlers, subscription states
        └── [subsystem].md    # Domain-bounded brief for active modules
```

> **The Subsystem Topology Invariant**: Never create feature-specific documentation (`agent-docs/add-stripe.md`). All knowledge must be integrated directly into the living **Subsystem Brief** (`agent-docs/modules/billing.md`).

---

## 4. Workflow A: Initializing Root Invariants & Codebase Map

When a user asks to "set up agent docs" or when introducing Hyperpowers to a codebase:

1. **Create/Verify Tier 1 Root Anchor (`CLAUDE.md` or `AGENTS.md`)**:
   Keep strictly under 60 lines:
   ```markdown
   # Project Architectural Invariants

   ## Commands
   - Build: `<build-cmd>`
   - Test targeted: `<test-cmd> <path/to/test>`
   - Lint & Typecheck: `<lint-cmd> && <typecheck-cmd>`

   ## Core Invariants
   - **Tooling**: Package manager or compiler constraints.
   - **Quality**: Non-negotiable architectural or accessibility rules.

   ## Deep Architecture (Read Just-in-Time)
   - Global Map: `agent-docs/architecture.md`
   - Active Backlog: `agent-docs/ideas.md`
   - Subsystems: `agent-docs/modules/*.md`
   ```

2. **Generate `agent-docs/architecture.md`**:
   - Limit to <60 lines using [templates/architecture-template.md](templates/architecture-template.md).
   - Tech stack, directory map, entry points, test commands.

3. **Subsystems are Documented Just-in-Time (JIT)**:
   - Module briefs in `agent-docs/modules/` are written **opportunistically** when a module is touched during a feature branch, never en masse upfront.

---

## 5. Workflow B: Auditing & Resolving Doc Drift

Before relying on an existing subsystem brief in `agent-docs/modules/<subsystem>.md`:

1. **Read Header Verified Commit**:
   ```markdown
   > **Verified Commit:** `f4b1e9a` (2026-10-24)
   > **Tracked Source Paths:** `src/billing/`
   ```
2. **Run Empirical Drift Check**:
   ```bash
   git diff --name-only <VERIFIED_COMMIT>..HEAD -- <TRACKED_SOURCE_PATHS>
   ```
3. **Adjudicate**:
   * *Output empty*: Document is 100% accurate. Trust contracts immediately.
   * *Output shows modified files*: Inspect the git delta, update the brief with current contracts, and advance the `Verified Commit` SHA.

---

## 6. Workflow C: Managing the Ideas Backlog

`agent-docs/ideas.md` captures high-value concepts without derailing active tasks:

1. **Adding an Idea**:
   Append a single concise entry using [templates/ideas-template.md](templates/ideas-template.md):
   ```markdown
   - [ ] **[Auth] Passkey Support**: WebAuthn biometric login option. *(Captured: 2026-10-24)*
   ```
2. **Auto-Reconciliation (Checking for Superseded / Done Ideas)**:
   When reviewing `agent-docs/ideas.md`:
   - *Is it already built?* $\rightarrow$ **Delete from `ideas.md`**.
   - *Is there a better architectural alternative or existing API?* (e.g. an idea to write a custom visualizer when a native library exists) $\rightarrow$ **Delete from `ideas.md`**.
   - *Did the user reject it?* $\rightarrow$ **Delete from `ideas.md`**.
3. **Zero-Token Deletion Policy**:
   Never keep resolved, superseded, or rejected items inside `ideas.md`. Prune them cleanly so `ideas.md` remains a high-signal file under 20 lines.
