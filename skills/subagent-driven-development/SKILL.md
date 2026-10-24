---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks by dispatching fresh subagents per task with review gates.
---

# Subagent-Driven Development

## Overview

Execute implementation plans with subagent isolation: dispatch fresh implementer subagents for decoupled tasks, run fast inline review gates upon completion, and maintain a live task artifact.

```
PARALLEL BATCH OR ISOLATED IMPLEMENTER ➔ FAST INLINE REVIEW GATE ➔ UPDATE TASK ARTIFACT ➔ NEXT BATCH
```

---

## Tooling & Architecture

* **Platform-Adaptive Agent Dispatch**: Use platform-native subagent tools (`invoke_subagent` in Antigravity, `Agent` in Claude Code, `spawn_agent` in Codex, `invoke_agent` in Gemini, `delegate_task` in Hermes). Support concurrent batch dispatch for independent tasks.
  - *Universal Fallback*: If your runtime lacks a subagent tool, do **not** fail; execute tasks sequentially inline using `hyperpowers:executing-plans`.
* **Task Ledger**: Maintain progress in the active **task ledger** (native task artifact in Antigravity, `TodoWrite` in Claude Code, `write_todos` in Gemini, or markdown checklist in plan file). Mark tasks completed (`- [x]`) as they pass verification.
* **The Zero-Idle Invariant**:
  - Subagents are throughput multipliers for concurrent parallel execution or heavy background tasks.
  - Never dispatch a single subagent for a sequential task only to sit idle waiting for it.
  - Review gates default to **Fast Inline Review** by the coordinator agent (seconds) rather than spawning another reviewer subagent and idling.
* **Autonomous Execution with Smart Escalation**:
  - Front-load questions during planning; once implementation starts, work through agreed tasks without routine "Should I continue?" check-ins.
  - Immediately pause and consult the user if:
    1. A discovery contradicts the plan or surfaces a major architectural fork.
    2. An action is destructive, irreversible, or security-sensitive.
    3. The task is fundamentally blocked and every path forward is a guess.

---

## The Task Execution Cycle

```
[1. Extract & Dispatch] ➔ [2. Watchdog Protection] ➔ [3. Fast Inline Review Gate] ➔ [4. Adjudicate Findings] ➔ [5. Update Task Ledger]
```

### 1. Extract Task Brief & Dispatch Implementers
* Read the current task(s) from the plan or task ledger.
* **Single Isolated Task**: Dispatch implementer via platform subagent tool using [implementer-prompt.md](implementer-prompt.md).
* **Parallel Independent Batch**: Dispatch all independent tasks concurrently using the platform's multi-agent dispatch (e.g. `invoke_subagent` with `Subagents: [...]`, or concurrent `Agent` calls).
* **Fallback**: If subagents are unavailable, execute inline in the session.

### 2. Watchdog & Implementer Execution
* **Watchdog Protection**: If supported, set a watchdog timer (`schedule` in Antigravity, `wait_agent` in Codex) to guard against network disconnects, server restarts, or silent stalls:
  ```json
  { "DurationSeconds": 450, "Prompt": "Check subagent liveness", "TimerCondition": "<conversationId>" }
  ```
  *(If the subagent finishes normally and replies, this timer is automatically cancelled early. Use `TimerCondition: "any"` for parallel batches).*
* **Liveness & Disconnect Recovery**:
  - If the timer fires or a system message indicates a server restart:
    1. Check agent status (`manage_subagents(Action: 'list')` in Antigravity, `list_agents` in Codex, etc.) to see if the subagent is `running`, `errored`, or dead.
    2. Check `git log -n 5` to identify any commits completed before the interruption.
    3. Revive the subagent by sending a status request, or re-dispatch a fresh subagent from the last committed git SHA.
* **Domain Implementation**: Implementers execute autonomously:
  * **Logic / API Tasks**: Strict TDD (`hyperpowers:test-driven-development`).
  * **UI / Presentation**: Multi-viewport visual verification (`ui-shot` at 375px, 768px, 1280px+) with zero console errors. No unit tests for static styling/copy.
  * **Static / Maintenance**: Compilation & syntax checks; link reachability (`curl -sI`).

### 3. Fast Inline Review Gate (Zero Idle Waiting)
* Upon implementer completion, the coordinator agent inspects the diff directly in the active turn:
  ```bash
  git diff --stat BASE_SHA..HEAD_SHA
  git diff BASE_SHA..HEAD_SHA
  ```
* Evaluate against the criteria in [task-reviewer-prompt.md](task-reviewer-prompt.md) or [code-reviewer.md](../requesting-code-review/code-reviewer.md).
* *Note*: Only dispatch an external subagent reviewer if evaluating multiple large, independent branches simultaneously or if explicitly requested by the user.

### 4. Adjudicate & Fix
* If review passes: Proceed to Step 5.
* If Critical or Important issues are found:
  - Send the specific findings back to the implementer subagent (or fix directly inline).
  - The implementer fixes the issues, re-runs verification, and updates its commit.
* If a reviewer suggestion conflicts with the specification or is YAGNI: Make a technical ruling and proceed.

### 5. Mark Complete & Continue
* Update the live task ledger (`- [ ]` $\rightarrow$ `- [x]`).
* Advance to the next task or batch in the plan autonomously, unless an escalation condition is met.

---

## Final Review & Completion

Once all tasks are marked complete in the task artifact:
1. Verify all checks pass cleanly (`hyperpowers:verification-before-completion`).
2. Perform whole-branch code review via `hyperpowers:requesting-code-review`.
3. Complete the branch using `hyperpowers:finishing-a-development-branch`.
