---
name: using-hyperpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring skill invocation before ANY response including exploring files or clarifying questions.
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, ignore this skill. Focus exclusively on your assigned task instructions.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

# Using Hyperpowers & Capability Routing

## Overview

Hyperpowers provides battle-tested engineering and visual design workflows for planning, debugging, testing, frontend aesthetics, and multi-viewport verification. Structured process discipline preserves context tokens, eliminates rework, and ensures verified production quality.

---

## The Rule

**Invoke relevant or requested skills BEFORE any response or action** — including clarifying questions, exploring the codebase, running shell commands, or checking files. If it turns out wrong for the situation, you don't have to use it.

**Before entering plan mode or writing plans:** if you haven't already brainstormed, invoke `hyperpowers:brainstorming` first.

**Mandatory Announcement:** Announce `"Using [skill] to [purpose]"` and call `view_file` on that skill immediately. Follow the skill instructions exactly. If it has a checklist, create a tracking todo per item.

---

## Skill Priority

When multiple skills apply, **process skills come first** — they discover intent, set the architecture, and establish gates; then implementation and domain skills carry them out:

- **"Build X", "Update feature X", "Redesign X", "Add component X"** → `hyperpowers:brainstorming` first! (For UI/visual tasks, invoke alongside `hyperpowers:frontend-design`). Then `hyperpowers:writing-plans`.
- **"Fix this bug", "Why is X failing", "Investigate issue"** → `hyperpowers:systematic-debugging` first! Then domain skills.

---

## Red Flags (Rationalization Inoculation)

These thoughts mean STOP — you are rationalizing avoiding process discipline:

| Thought | Reality |
| :--- | :--- |
| *"This is just a simple question or tweak"* | Questions and small tweaks are tasks. Check for skills. |
| *"I need more context / let me explore the codebase first"* | Skills tell you HOW to explore and what questions to ask. Check first. |
| *"I can check git / files quickly with `ls` or `grep`"* | Files lack intent and conversation context. Check for skills. |
| *"The user gave very specific instructions with an image"* | Detailed requests still require brainstorming and architecture alignment. |
| *"This doesn't need a formal skill"* | If a skill exists, use it. |
| *"I remember this skill from earlier"* | Skills evolve and have specific checklists. Read current version. |
| *"The skill is overkill for this"* | Simple tasks become complex regressions. Use the skill. |
| *"I'll just do this one edit first"* | Check BEFORE touching any file. |
| *"This feels productive to just start coding"* | Undisciplined hacking causes regressions and token waste. Skills prevent this. |
| *"User instructions take precedence so I can skip"* | User precedence applies ONLY when the user explicitly commands *"skip skills"*. |

---

## The Capability Routing Matrix

Invoke the appropriate process skill before jumping into code or raw execution:

| User Intent / Engineering Phase | Primary Skill | Core Invariant |
| :--- | :--- | :--- |
| **New feature, exploration, redesign, or design choice** | `hyperpowers:brainstorming` | Clarify intent and trade-offs before building. Lead with technical recommendation first. |
| **New frontend UI/UX aesthetic direction** | `hyperpowers:frontend-design` | Domain-anchored aesthetics, tailored typography, 4-state coverage, ban AI visual clichés. |
| **Updating, refactoring & 10/10 UI evolution** | `hyperpowers:ui-evolution` | Token harvesting (zero redundant CSS), visual forensics, 10/10 self-critique with mockups. |
| **Searchable UI/UX styles, palettes & fonts** | `hyperpowers:ui-ux-pro-max` | 79 styles, 192 product palettes, 74 font pairings, 119 UX rules via local `search.py`. |
| **Component composition, registry & presets** | `hyperpowers:shadcn` | Component scaffolding, registry discovery (`npx shadcn@latest add`), preset design systems. |
| **Out-of-distribution craft floor & UX polish** | `hyperpowers:impeccable` | Surface modes (*Operate*, *Read*, *Persuade*), tactile physics, micro-interactions, `DESIGN.md`. |
| **Web Interface Guidelines & a11y audit** | `hyperpowers:web-design-guidelines` | Vercel guidelines compliance, tap targets ($\ge 44\times 44$px), keyboard navigation, WCAG AA. |
| **Chrome DevTools automation & visual QA** | `hyperpowers:visual-verification` | Stateful Chrome DevTools sessions for UI flows + multi-viewport responsive checks via `ui-shot`. |
| **Multi-step implementation planning** | `hyperpowers:writing-plans` | Break work into bite-sized tasks with domain-specific verification. Prefer native plan tools. |
| **Executing plan (Master Engine: Hybrid / SDD / Inline)** | `hyperpowers:executing-plans` | Mode 1: Hybrid (default), Mode 2: Sandboxed SDD, Mode 3: Native Inline. Zero-idle invariant. |
| **Parallel orthogonal tasks** | `hyperpowers:dispatching-parallel-agents` | Analyze dependency graph; dispatch concurrent subagents only when decoupled. |
| **Isolated workspace & branch setup** | `hyperpowers:using-git-worktrees` | Parallel development branches and worktrees protecting active working tree. |
| **Bug, test failure, build error, or regression** | `hyperpowers:systematic-debugging` | Causal root investigation before any fix attempt. Detect thrashing early. |
| **Dynamic logic, state, or API contracts** | `hyperpowers:test-driven-development` | Strict Red-Green-Refactor. Reject test theater for static code or CSS. |
| **Claiming completion, fix, or green build** | `hyperpowers:verification-before-completion` | File-level syntax sanity (`check-syntax.py`) + empirical test/build evidence. |
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
   - **Google Antigravity (`agy`)**: [antigravity-tools.md](references/antigravity-tools.md) — Plan/Task Artifacts, `invoke_subagent` batch arrays, `schedule` watchdog, Chrome DevTools / `ui-shot`.
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

## User Instructions & Precedence

User instructions (direct requests, `hyperpowers.json`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) take precedence over skill defaults, which in turn override default agent behavior.

> **CRITICAL EXCEPTION**: Only skip skill workflows or instructions when your human partner has **explicitly told you to skip them** (e.g. *"skip brainstorming"*, *"just code directly without plans"*). A direct request to build, redesign, or fix something is NOT an instruction to skip process skills.

### Runtime Configuration (`hyperpowers.json`)
Hyperpowers checks for project settings in `hyperpowers.json` or `.hyperpowers/config.json` (conforming to `hyperpowers.schema.json`) and environment variables (`HYPERPOWERS_*`):
- `execution.mode`: Default execution mode (`"hybrid"`, `"sdd"`, `"inline"`).
- `execution.taskCap`: Implementation plan task cap before milestone splitting (default: `7`).
- `execution.watchdogTimeoutSeconds`: Watchdog liveness timeout (default: `450`).
- `debugging.circuitBreakerThreshold`: Consecutive failed fix attempts before halting (default: `2`).
- `testing.targetedInnerLoop`: Test only active file on inner TDD cycle (default: `true`).
- `visual.viewports`: Custom dimensions for Mobile, Tablet, Desktop.
- `telemetry`: Enable/disable external badge requests (default: `false`).

When the user requests setting adjustments in chat (e.g. *"Set task cap to 5"*), update `hyperpowers.json` directly.
