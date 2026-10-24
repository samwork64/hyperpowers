---
name: using-hyperpowers
description: Use when starting any conversation - establishes how to navigate, invoke, and leverage specialized skills and native platform capabilities.
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, ignore this skill. Focus exclusively on your assigned task instructions.
</SUBAGENT-STOP>

# Using Hyperpowers & Capability Routing

## Overview

Hyperpowers provides battle-tested engineering and visual design workflows for planning, debugging, testing, frontend aesthetics, and multi-viewport verification. Structured process discipline preserves context tokens, eliminates rework, and ensures verified production quality.

---

## The Capability Routing Matrix

Invoke the appropriate process skill before jumping into code or raw execution:

| User Intent / Engineering Phase | Primary Skill | Core Invariant |
| :--- | :--- | :--- |
| **New feature, exploration, or design choice** | `hyperpowers:brainstorming` | Clarify intent and trade-offs before building. Lead with technical recommendation first. |
| **Frontend UI/UX aesthetic direction** | `hyperpowers:frontend-design` | Domain-anchored aesthetics, tailored typography, 4-state coverage, ban AI visual clichés. |
| **Multi-viewport visual QA & screenshots** | `hyperpowers:visual-verification` | Ephemeral headless CDP capture (Mobile/Tablet/Desktop/Full-Page) via `ui-shot.cjs`. |
| **Multi-step implementation planning** | `hyperpowers:writing-plans` | Break work into bite-sized tasks with domain-specific verification. Prefer native plan tools. |
| **Executing plan (Master Engine: Hybrid / SDD / Inline)** | `hyperpowers:executing-plans` | Mode 1: Hybrid (default), Mode 2: Sandboxed SDD, Mode 3: Native Inline. Zero-idle invariant. |
| **Executing plan (Full Subagent Isolation)** | `hyperpowers:subagent-driven-development` | Fresh implementer per task in dedicated workspace with coordinator review gates. |
| **Parallel orthogonal tasks** | `hyperpowers:dispatching-parallel-agents` | Analyze dependency graph; dispatch concurrent subagents only when decoupled. |
| **Bug, test failure, build error, or regression** | `hyperpowers:systematic-debugging` | Causal root investigation before any fix attempt. Detect thrashing early. |
| **Dynamic logic, state, or API contracts** | `hyperpowers:test-driven-development` | Strict Red-Green-Refactor. Reject test theater for static code or CSS. |
| **Claiming completion, fix, or green build** | `hyperpowers:verification-before-completion` | Demand fresh empirical evidence across domain matrix before making claims. |
| **Receiving review feedback or PR comments** | `hyperpowers:receiving-code-review` | 4-quadrant technical deliberation over performative agreement. |
| **Requesting code review** | `hyperpowers:requesting-code-review` | Audit against 6-axis rubric; default to fast inline self-review. |
| **Finalizing branch or feature** | `hyperpowers:finishing-a-development-branch` | Verify tests/builds on clean tree; reconcile ideas backlog; present PR/merge options. |
| **Codebase memory & ideas backlog** | `hyperpowers:managing-agent-docs` | Maintain living subsystem briefs in `agent-docs/` and reconcile active ideas. |
| **Creating or refining agent skills** | `hyperpowers:writing-skills` | Test-driven skill design, YAML schema conformance, subagent verification. |
| **Diagnosing agent sessions & bug reports** | `hyperpowers:diagnosing-hyperpowers` | Objective forensic bundle capture without speculative self-diagnosis. |

---

## The Subagent Allocation & Zero-Idle Invariant

Subagents are throughput multipliers for concurrent and isolated workloads. They are **not** an excuse for the parent agent to stop working:

1. **When to Dispatch Subagents**:
   - **True Parallel Concurrency**: $\ge 2$ decoupled, independent tasks dispatched in a single concurrent batch (`Subagents: [...]`).
   - **Non-Blocking Background Delegation**: A heavy, long-running task running in the background *while* the parent agent continues active development.
   - **Context Isolation**: Exploratory, log-heavy, or deeply nested research tasks that would otherwise pollute the parent context window.
2. **The Zero-Idle Invariant (Anti-Pattern Banned)**:
   - **NEVER** dispatch a single subagent for a sequential or blocking task only to sit completely idle waiting for it to finish.
   - If a task is sequential, tightly coupled, or blocking the next step, execute it **natively inline** in the current session. Inline execution provides instantaneous feedback, zero spin-up latency, and zero token waste.

---

## Platform Capability Detection & Adaptation

Skills declare abstract actions (*Plan Storage*, *Task Tracking*, *Subagent Dispatch*, *Code Review*, *Domain Verification*). Detect your current agent platform and resolve these actions to the most capable native tools available:

1. **Platform Reference Mappings**:
   - **Google Antigravity (`agy`)**: [antigravity-tools.md](references/antigravity-tools.md) — Plan/Task Artifacts, `invoke_subagent` batch arrays, `schedule` watchdog, `ui-shot`.
   - **Claude Code (`claude`)**: [claude-code-tools.md](references/claude-code-tools.md) — Native Plan Mode, `TodoWrite` / `TodoRead`, `Agent` tool.
   - **OpenAI Codex (`codex`)**: [codex-tools.md](references/codex-tools.md) — `spawn_agent` V2, `followup_task`, `wait_agent` event subscription.
   - **Gemini CLI (`gemini`)**: [gemini-tools.md](references/gemini-tools.md) — `enter_plan_mode`, `write_todos` / `tracker_*`, `invoke_agent` (`@generalist`).
   - **Hermes Agent (`hermes`)**: [hermes-tools.md](references/hermes-tools.md) — `delegate_task`, `todo` tool, `skill_view`.
   - **Muse**: [muse-tools.md](references/muse-tools.md) — `subagent_spawn`, `write_todos`.
   - **Pi**: [pi-tools.md](references/pi-tools.md) — Optional `subagent`, `TODO.md` / plan checklist.
   - **Universal Default Fallback**: [default-tools.md](references/default-tools.md) — For Cursor, Windsurf, Copilot CLI, Devin, OpenCode, Aider, or generic CLI harnesses. Saves plans to `docs/plans/`, tracks tasks via markdown checklist, and executes sequentially inline if subagent tools are unavailable.
   - **Agent Memory & Ideas Backlog**: [agent-docs-and-ideas.md](references/agent-docs-and-ideas.md) — Living subsystem topology, Git Commit SHA drift guard, and active ideas lifecycle.

2. **Universal Invariants Across All Platforms**:
   - **Zero-Idle Invariant**: NEVER dispatch a single subagent for a sequential task and sit idle waiting for it.
   - **Inline Review by Default**: The coordinator inspects diffs directly against the rubric in current turn (seconds).
   - **Zero Textual Duplication**: Never dump 100+ lines of raw plan text into chat when a dedicated ledger or file exists.
   - **Domain-Adaptive Verification**: TDD for logic/contracts, visual verification for UI, compile/link gates for static.

---

## User Precedence

User instructions (direct requests, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) take precedence over skill defaults. Tailor process rigor to the specific context requested by the user.
