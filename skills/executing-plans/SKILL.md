---
name: executing-plans
description: Use when executing an implementation plan using the Hybrid model (inline execution for sequential tasks, parallel subagents for independent batches) or pure native inline execution.
---

# Hybrid & Inline Plan Execution

## Overview

Execute implementation plans using the **Hybrid Execution Model (Default)**: sequential tasks flow natively inline for speed and responsiveness, while independent tasks run concurrently via parallel subagents.

```
SEQUENTIAL TASKS: INLINE ➔ INDEPENDENT TASKS: PARALLEL SUBAGENTS ➔ INLINE REVIEW GATE
```

---

## The Execution Protocol

### 1. Setup & Task Ledger Initialization
* **Workspace Isolation**: Ensure work occurs on a dedicated branch or worktree (`hyperpowers:using-git-worktrees`).
* **Platform-Adaptive Task Ledger**:
  * *Native Artifact Platforms (e.g. Antigravity)*: Maintain live task artifact (`ArtifactMetadata.ArtifactType: "task"`), updating with `replace_file_content`.
  * *Native Todo Platforms (e.g. Claude Code, Gemini CLI, Hermes)*: Use `TodoWrite`, `write_todos`, or `todo` tool.
  * *Default Tooling (OpenAI Codex, Cursor, Copilot, generic CLI)*: Maintain checklist (`- [ ]` / `- [x]`) directly in the plan markdown file, or use bundled helper scripts (`task-start`, `task-done`).
* **Autonomous Flow with Smart Escalation**:
  - Front-load questions during planning; once execution starts, work through agreed tasks without routine "Should I continue?" check-ins.
  - Immediately pause and consult the user if an unexpected finding contradicts a plan assumption, requires an irreversible/destructive action, or surfaces a major architectural fork.
* **Compaction Recovery**: Conversation history does not survive context compaction. When a session is compacted mid-run:
  1. Re-read the task ledger (artifact, todo list, or plan file) to inspect completed items (`- [x]`).
  2. Run `git log --oneline -n 10` to confirm the latest commits on the branch.
  3. Resume execution strictly from the first unchecked task (`- [ ]`).

---

## 2. Hybrid Task Execution Loop

Inspect the concurrency tag on the next task:

### Path A: Sequential Tasks (`[Sequential]`)
Execute directly inline in the current session:
1. **Domain Verification Steps**:
   * *Logic & Contracts*: Strict TDD (`hyperpowers:test-driven-development`).
   * *UI & Presentation*: Markup/CSS styling $\rightarrow$ multi-viewport visual check via `ui-shot` (Mobile 375px, Tablet 768px, Desktop 1280px+) $\rightarrow$ verify 0 console errors. No unit tests for static text or CSS.
   * *Static & Config*: Edit $\rightarrow$ link check (`curl -sI`) $\rightarrow$ compiler/typecheck gate.
2. **Verify & Commit**: Run verification command and commit (`git commit -m "feat([scope]): [description]"`).
3. **Update Task Ledger**: Mark task complete (`- [x]`) in the active ledger.

### Path B: Independent Task Batches (`[Parallel Batch N]`)
Execute orthogonal tasks concurrently:
1. **Concurrent Dispatch Across Platforms**:
   - *Antigravity*: Issue all tasks in a single `invoke_subagent` call with `Subagents: [...]`.
   - *Claude Code*: Dispatch concurrent `Agent` tool calls.
   - *Gemini CLI*: Dispatch concurrent `invoke_agent` calls in one response.
   - *Codex*: Dispatch `spawn_agent` (`fork_turns: "none"`).
   - *Default Fallback (no subagents available)*: Automatically execute tasks sequentially inline in the current session.
2. **Watchdog & Liveness**: Set a watchdog timer if supported (`schedule` in Antigravity, `wait_agent` in Codex) or monitor activity.
3. **Synthesis & Invariant Check**: Upon batch completion, inspect diffs, verify combined build/test passes, and mark all batch tasks complete (`- [x]`) in the task ledger.

---

## 3. Final Verification & High-Speed Review

Once all tasks in the task ledger are marked complete:
1. **Universal Build Gate**: Run full test suite, linter, and typechecker (`hyperpowers:verification-before-completion`).
2. **Inline Code Review (Zero Idle Waiting)**:
   * Perform inline self-review directly against the [code-reviewer.md](../requesting-code-review/code-reviewer.md) rubric.
   * Inspect `git diff BASE..HEAD` directly in the session—zero subagent spin-up latency, zero idle wait.
   * Fix any Critical or Important issues immediately.
3. **Branch Completion**: Proceed to `hyperpowers:finishing-a-development-branch` to present integration options.
