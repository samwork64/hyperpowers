---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements and architectural invariants.
---

# Requesting Code Review

## Overview

**Core Principle:** Review early and often against architectural invariants. Default to high-speed inline self-review; reserve subagents for true parallel multi-module auditing or when explicitly requested.

```
DEFAULT TO FAST INLINE REVIEW ➔ ZERO IDLE WAITING ➔ RESERVE SUBAGENTS FOR PARALLEL BATCHES
```

---

## 1. The Zero-Idle Invariant

```
NEVER DISPATCH A SINGLE SUBAGENT ONLY TO SIT IDLE WAITING FOR IT
```

* **Inline Self-Review (Default & Recommended)**: The coordinator agent inspects `git diff BASE..HEAD` directly in the current turn against the [code-reviewer.md](code-reviewer.md) rubric. It executes in seconds with zero latency, zero token waste, and zero idle downtime.
* **When to Dispatch Subagent Reviewers**:
  1. **Parallel Multi-Module Review**: When 2+ independent subsystems need simultaneous review, dispatch them concurrently in parallel using the platform's subagent tool.
  2. **Non-Blocking Background Review**: When the subagent reviews Module A in the background *while* the main agent continues developing Module B.
  3. **Explicit User Request**: When the user explicitly requests an isolated, independent subagent review.

---

## 2. Review Protocol (Inline Execution)

1. **Collect Diff Range**:
   ```bash
   BASE_SHA=$(git rev-parse HEAD~1)  # Or merge-base against main/target
   HEAD_SHA=$(git rev-parse HEAD)
   git diff --stat "$BASE_SHA".."$HEAD_SHA"
   git diff "$BASE_SHA".."$HEAD_SHA"
   ```

2. **Evaluate Against Domain Criteria**:
   Evaluate the diff directly using the rubric in [code-reviewer.md](code-reviewer.md):
   * **Logic & APIs**: Contracts, input validation, boundary edge cases, real behavior tests (no test theater).
   * **Systems & Native**: Memory clean, resource release (sockets/files), thread safety, zero compiler warnings.
   * **CLI & Tools**: Exit codes, stdout/stderr purity, flag parsing.
   * **UI & Presentation**: Responsive viewports, contrast, clean console logs. No unit tests for static text or CSS.

3. **Adjudicate Findings**:
   * **Critical (Must Fix)**: Broken contracts, logic bugs, data loss, build breaks $\rightarrow$ fix immediately.
   * **Important (Should Fix)**: Missing edge cases, architectural coupling, resource leaks $\rightarrow$ resolve before merging.
   * **Minor (Optional / Polish)**: Naming, style consistency $\rightarrow$ track in task ledger or set aside if YAGNI.
