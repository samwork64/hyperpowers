---
name: executing-plans
description: Use when executing an approved implementation plan using Hybrid, Sandboxed SDD, or Native Inline execution modes with compaction recovery and zero-idle review gates.
---

# Master Plan Execution Engine

## Overview

The execution engine translates approved implementation plans into verified, production-grade code. It eliminates the traditional trade-off between speed and isolation by offering three interoperable execution modes, all governed by the **Zero-Idle Invariant**.

```
[APPROVED PLAN] ➔ [SELECT EXECUTION MODE] ➔ [TASK EXECUTION LOOP] ➔ [FAST INLINE REVIEW] ➔ [FINAL VERIFICATION]
```

---

## 1. The Three Execution Modes

Select the execution mode matched to your runtime capabilities and project requirements:

| Execution Mode | Ideal Workload | Mechanics |
| :--- | :--- | :--- |
| **Mode 1: Hybrid Execution (Recommended / Default)** | Standard multi-task features, full-stack apps, mixed backend/frontend workloads. | **Sequential tasks** execute natively inline for zero latency and continuous momentum; **independent batches** dispatch concurrently to parallel subagents. |
| **Mode 2: Sandboxed Subagent Execution (SDD Mode)** | High-risk refactors, massive multi-file changes, untrusted tasks, or when strict isolation is demanded. | Every task runs in an isolated subagent workspace using [templates/implementer-prompt.md](templates/implementer-prompt.md) with independent verification gates. |
| **Mode 3: Native Inline Execution** | Single-module features, lightweight CLI tasks, or runtimes lacking subagent primitives. | All tasks execute sequentially in the parent session. Zero subagent overhead, instant feedback. |

*Configuration Override*: Default mode can be customized via `execution.mode` in `hyperpowers.json` or environment variable `HYPERPOWERS_EXECUTION_MODE` (`"hybrid"`, `"sdd"`, `"inline"`).

> **The Zero-Idle Invariant (Universal Rule)**:
> Subagents are throughput multipliers for concurrent parallel execution ($\ge 2$) or non-blocking background delegation. **NEVER** dispatch a single subagent for a sequential task and sit idle waiting for it. If a task is sequential, execute it natively inline.

---

## 2. Setup & Resilience Protocols

### A. Workspace Isolation & Task Ledger
1. **Branch/Worktree Isolation**: Ensure work occurs on an isolated branch or git worktree (`hyperpowers:using-git-worktrees`).
2. **Platform-Adaptive Task Ledger**:
   - **Native Artifact Platforms (e.g. Antigravity)**: Maintain a live task artifact (`ArtifactMetadata.ArtifactType: "task"`), updating state with `replace_file_content`.
   - **Native Todo Platforms (e.g. Claude Code, Gemini CLI, Hermes)**: Use `TodoWrite`, `write_todos`, or `todo` tool.
   - **Default Tooling (OpenAI Codex, Cursor, Copilot, generic CLI)**: Maintain markdown checklist (`- [ ]` / `- [x]`) in the plan file, or use helper scripts (`task-start`, `task-done`).

### B. Conversation Compaction Recovery
Conversation context does not survive LLM compaction. When a session is compacted or restarted mid-run:
1. Re-read the active task ledger (artifact, todo list, or plan file) to identify completed tasks (`- [x]`).
2. Run `git log --oneline -n 10` and `git status` to verify the exact state of the working tree.
3. If background subagents or daemon tasks were in-flight, query running processes (`manage_subagents(Action: 'list')` or platform equivalent) to reconnect.
4. Automatically resume execution from the first unchecked task (`- [ ]`) without re-asking the user.

### C. Watchdog Protection & Disconnect Revival
When dispatching subagents, network drops or server restarts can cause silent stalls:
1. **Watchdog Timer**: If supported by your runtime (`schedule` in Antigravity, `wait_agent` in Codex), set an early-cancelling watchdog timer:
   ```json
   { "DurationSeconds": 450, "Prompt": "Check subagent liveness", "TimerCondition": "<subagent-id>" }
   ```
2. **Disconnect Revival**: If the watchdog triggers or a server restart message occurs:
   - Check subagent status (`manage_subagents(Action: 'list')` or platform equivalent).
   - Check `git log -n 5` for commits completed prior to the interruption.
   - Send a liveness ping, or re-dispatch from the latest committed git SHA.

### D. Autonomous Flow with Smart Escalation
Front-load all design questions during planning. Once execution begins:
- Work through agreed tasks autonomously without routine "Should I continue?" interruptions.
- **Immediately pause and escalate to the user ONLY if**:
  1. A critical discovery directly contradicts a plan assumption or reveals an unviable architectural fork.
  2. An action is destructive, irreversible, or security-sensitive (e.g. dropping production databases, deleting untracked files).
  3. All forward progress is fundamentally blocked and further action would be speculative guesswork.

---

## 3. The Execution Loop

Follow the protocol matching your selected execution mode:

### Mode 1: Hybrid Execution (Default)

Inspect the next task's tag in the plan:

#### Path A: Sequential Task (`[Sequential]`)
Execute directly inline in the current session following the **3-Phase Task Execution Gate**:

1. **Pre-Task Skill Activation Gate**:
   Inspect the bound `[Skill: <name>]` tag in the task ledger:
   - `[Skill: test-driven-development]`: Write the failing test first (RED) before modifying product code. Test the actual contract boundary.
   - `[Skill: ui-direction]`: Anchor in physical subject matter; ban AI visual clichés; implement all 4 states (empty, skeleton, error, interactive).
   - `[Skill: ui-components]`: Compose semantic components; reuse tokens; enforce accessibility presets.
   - `[Skill: ui-evolution]`: Harvest existing CSS/tokens first (*reuse first, invent never*); score visual changes against 5-axis rubric ($\ge 9/10$ floor).
   - `[Skill: ui-verification]`: Run multi-viewport audits (375px, 768px, 1280px); zero visual defect or layout clipping.
   - `[Skill: systematic-debugging]`: Formulate a falsifiable hypothesis before touching code.
   - `[Skill: verification-before-completion]`: Run static parse checks (`check-syntax.py`) and compile gates.

2. **Inner Execution & Domain Verification**:
   - *Logic / Contracts*: Run **targeted test file** during the inner cycle (never run the whole test suite on every line edit).
   - *UI / Presentation*: Multi-viewport visual check via `ui-shot` (Mobile 375px, Tablet 768px, Desktop 1280px+) or warm Chrome DevTools session. Zero console errors.
   - *Static / Config*: Link check (`curl -sI`) + compiler/typecheck gate (`tsc --noEmit`, `py_compile`).

3. **Post-Task Inline Code Review Gate (`requesting-code-review`)**:
   - Before marking completed (`- [x]`) or committing, conduct a 15-second inline review against [`code-review-rubric.md`](../requesting-code-review/references/code-review-rubric.md):
     - No orphan debugging statements or console logging.
     - Contracts and error paths handled.
     - WCAG AA contrast ($\ge 4.5:1$) and touch targets ($\ge 44\times 44$px) maintained.
   - Commit atomic diff (`git commit -m "feat([scope]): [description]"`).
   - Mark completed (`- [x]`) in the active task ledger artifact.

#### Path B: Independent Batch (`[Parallel Batch N]`)
Verify the decoupling invariants before dispatch:
- **File Disjointness**: Do tasks touch separate files/directories?
- **State Isolation**: Are database tables, cache keys, and ports isolated?
- **Zero Temporal Dependency**: Can all tasks run without waiting for outputs of each other?

1. **Concurrent Dispatch**:
   - Record active subagent conversation IDs in the task ledger so handles survive session compaction.
   - *Antigravity*: Issue all tasks in a single `invoke_subagent` call with `Subagents: [...]`.
   - *Claude Code*: Dispatch concurrent `Agent` tool calls.
   - *Gemini CLI*: Dispatch concurrent `invoke_agent` calls in one response.
   - *Codex*: Dispatch concurrent `spawn_agent` (`fork_turns: "none"`).
   - *Fallback (no subagents)*: Execute sequentially inline. Never hallucinate tools.
2. **Synthesis & Invariant Check**:
   - Inspect diffs of each subagent upon completion.
   - Run combined test/build suite.
   - Mark all batch tasks completed (`- [x]`) in the active ledger.

---

### Mode 2: Sandboxed Subagent Execution (SDD Mode)

For high-isolation tasks requiring dedicated workspaces:
1. **Workspace Provisioning**: Create dedicated directory or worktree per task using [scripts/sdd-workspace](scripts/sdd-workspace) or native worktrees.
2. **Dispatch Implementer (Minimal Context Slicing)**: Dispatch fresh subagent using [templates/implementer-prompt.md](templates/implementer-prompt.md). Pass **ONLY** the 15–30 line task brief and relevant interface contracts; never paste the entire multi-task implementation plan.
3. **Inline Review Gate**: Upon implementer completion, inspect the diff immediately in the active coordinator turn:
   ```bash
   git diff --stat BASE_SHA..HEAD_SHA
   git diff BASE_SHA..HEAD_SHA
   ```
   Evaluate against [code-review-rubric.md](../requesting-code-review/references/code-review-rubric.md), or dispatch a review using [templates/task-reviewer-prompt.md](templates/task-reviewer-prompt.md). If fixes are needed, re-review with [templates/re-review-prompt.md](templates/re-review-prompt.md).
3. **Adjudication**:
   - If clean: Mark completed (`- [x]`) and proceed.
   - If issues found: Send concrete findings back to implementer or fix surgical deltas inline.

---

### Mode 3: Native Inline Execution

For lightweight environments or single-module workflows:
- Execute every task sequentially inline using Path A of the Hybrid loop.
- Provides immediate feedback, lowest token consumption, and zero subagent latency.

---

## 4. Final Verification & Completion Gate

Once all tasks in the ledger are checked (`- [x]`):

1. **File-Level Syntax & Static Sanity Pass**: Run `python3 <path-to-hyperpowers>/skills/verification-before-completion/scripts/check-syntax.py` across all modified files. Verify zero syntax or structural parse errors before running high-level suites.
2. **Universal Build Gate**: Run the full project test suite, typechecker, and linter (`hyperpowers:verification-before-completion`).
3. **Fast Inline Code Review**:
   - Inspect whole-branch diff (`git diff BASE_BRANCH..HEAD`).
   - Audit against the 6 evaluation axes in [code-review-rubric.md](../requesting-code-review/references/code-review-rubric.md).
   - Resolve any Critical or Important issues immediately.
4. **Branch Finalization**: Proceed to `hyperpowers:finishing-a-development-branch` to reconcile `agent-docs/ideas.md`, update subsystem briefs with the latest git commit SHA, and present clean merge/PR options.
