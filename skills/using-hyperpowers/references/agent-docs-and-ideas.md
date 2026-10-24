# Agent Documentation & Ideas Backlog Architecture

`agent-docs/` provides persistent, token-efficient architectural memory for coding agents across sessions, compactions, and branches. It prevents cold-start file exploration and tracks creative ideas without polluting human documentation directories.

---

## 1. Directory Structure & Separation of Concerns

* **`docs/`**: Reserved for human documentation, public API references, and static site generators (Docusaurus, MkDocs, Nextra). Never dump agent scratchpads here.
* **`agent-docs/`**: Machine-optimized engineering briefs, living subsystem contracts, and the active ideas backlog:

```
agent-docs/
├── architecture.md           # [Global Overview] Tech stack, top-level directories, entry points, core invariants
├── ideas.md                  # [Active Backlog] Strictly active, high-signal uncommitted ideas (zero token waste)
├── ideas-archive.md          # [Optional Archive] 1-line audit log of resolved ideas (pruned by default)
└── modules/                  # [Subsystem Briefs] Living domain-bounded contracts (30–50 lines each)
    ├── auth.md               # Auth flows, token storage, middleware gotchas, verified commit SHA
    ├── billing.md            # Stripe/payment flows, webhook handlers, subscription state transitions
    └── [subsystem].md        # Domain-bounded brief for active modules
```

---

## 2. The Subsystem Topology Invariant (Eliminating Feature Sprawl)

> **Core Invariant:** Features are **ephemeral**; Subsystems are **persistent**.  
> Features live and die in plans and pull requests. Never create feature-specific documentation (`agent-docs/add-stripe-checkout.md`). All knowledge must be incorporated directly into the living **Subsystem Brief** (`agent-docs/modules/billing.md`).

* Total files in `agent-docs/modules/` mirrors the actual component architecture (typically 4–8 files total).
* When a feature modifies a subsystem, it updates that subsystem's existing brief in place.
* When a subsystem is deprecated or deleted, its brief is removed.

---

## 3. The Git Commit SHA Drift Guard

File modification timestamps (`mtime`) fail across git branch switches and worktrees. Every subsystem brief stamps its ground-truth git commit SHA:

```markdown
# [Subsystem Name] Subsystem Brief

> **Verified Commit:** `f4b1e9a` (YYYY-MM-DD)
> **Tracked Source Paths:** `src/billing/`, `prisma/migrations/*billing*`

## Architectural Invariants & Contracts
- [Contract rule 1]
- [Contract rule 2]

## Non-Obvious Gotchas & Known Failure Modes
- [Gotcha 1]
```

### 1-Second Empirical Drift Check
Before reading or trusting a subsystem brief, verify whether the source files have drifted:

```bash
git diff --name-only <VERIFIED_COMMIT_SHA>..HEAD -- <TRACKED_SOURCE_PATHS>
```

* **Clean (empty output)**: The document is 100% in sync with the codebase. The agent trusts the brief immediately, saving thousands of tokens on file reading.
* **Dirty (output lists files)**: The code has drifted since the last documentation pass. The agent inspects the file delta, relies on ground-truth code, and updates the brief during branch finalization.

---

## 4. The Living Ideas Backlog Protocol

`agent-docs/ideas.md` stores high-value concepts, proposed refactorings, and architectural suggestions without derailing the active turn.

### The 4 Resolution States:
1. **Active**: Under consideration. Kept in `agent-docs/ideas.md`.
2. **Promoted**: Accepted and converted into an active implementation plan (`hyperpowers:writing-plans`).
3. **Implemented**: Built, tested, and merged $\rightarrow$ **Deleted from `ideas.md`**.
4. **Superseded**: Rendered obsolete by a better architectural alternative, an existing API, or a dependency upgrade $\rightarrow$ **Deleted from `ideas.md`**.

### Zero-Token Policy (Clean Pruning):
* Never keep resolved, rejected, or superseded ideas inside `agent-docs/ideas.md`.
* `ideas.md` contains **strictly active candidates** (aiming for $\le 10$ items).
* If an audit trail is desired, append a single line to `agent-docs/ideas-archive.md`; otherwise delete directly.

### Format for `agent-docs/ideas.md`:
```markdown
# Ideas Backlog

- [ ] **[Area] Short Title**: 1-2 sentence core value + trigger condition. *(Captured: YYYY-MM-DD)*
```

---

## 5. Lifecycle Read/Write Matrix

| Phase | Action | Target Document |
| :--- | :--- | :--- |
| **Intake / Brainstorming** | **Read** | `agent-docs/architecture.md` (fast orientation). Review `agent-docs/ideas.md` with auto-reconciliation (detecting superseded ideas). |
| **Out-of-Scope Idea Surfaces** | **Write** | Append 1-line item to `agent-docs/ideas.md` rather than losing context. |
| **Planning & Design** | **Read** | Relevant `agent-docs/modules/<subsystem>.md` with git commit SHA drift check. |
| **Runtime & Debugging** | **Read** | Check subsystem "Gotchas & Invariants" before altering shared contracts. |
| **Branch Finalization** | **Write / Prune** | 1. Update modified subsystem brief in `agent-docs/modules/` and stamp current HEAD commit SHA.<br>2. Check `agent-docs/ideas.md`, ask user confirmation, and prune completed/superseded items. |
