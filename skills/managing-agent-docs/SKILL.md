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

## 2. Directory Layout & Standards

```
agent-docs/
├── architecture.md           # [Global] Tech stack, top-level directories, entry points, core invariants (~50 lines)
├── ideas.md                  # [Active Backlog] Strictly active, high-signal ideas (zero token waste)
└── modules/                  # [Subsystems] Living, domain-bounded briefs (30–50 lines each)
    ├── auth.md               # Auth flows, session storage, middleware gotchas, verified commit SHA
    ├── billing.md            # Stripe/payment flows, webhook handlers, subscription states
    └── [subsystem].md        # Domain-bounded brief for active modules
```

> **The Subsystem Topology Invariant**: Never create feature-specific documentation (`agent-docs/add-stripe.md`). All knowledge must be integrated directly into the living **Subsystem Brief** (`agent-docs/modules/billing.md`).

---

## 3. Workflow A: Initializing a Codebase Map

When a user asks to "set up agent docs" or when introducing Hyperpowers to a legacy codebase:

1. **Avoid Upfront Full-Repo Bloat**:
   - Do **NOT** document all 50+ files in the repository.
   - Generate **ONLY** `agent-docs/architecture.md` using [templates/architecture-template.md](templates/architecture-template.md).
2. **Keep it Under 60 Lines**:
   - Tech stack & runtime versions.
   - Directory map (which folder does what).
   - Core entry points (server, client, database connection).
   - Primary test & build commands (`npm test`, `pytest`, `cargo test`).
3. **Subsystems are Documented Just-in-Time (JIT)**:
   - Module briefs in `agent-docs/modules/` are written **opportunistically** when a module is touched during a feature branch, never en masse upfront.

---

## 4. Workflow B: Auditing & Resolving Doc Drift

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

## 5. Workflow C: Managing the Ideas Backlog

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
