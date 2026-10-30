---
name: receiving-code-review
description: Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable. Requires technical rigor and objective evaluation over performative agreement.
---

# Code Review Deliberation & Reception

## Overview

**Core Principle:** Code review is a technical evaluation of invariants, architecture, and correctness—not a social performance. Evaluate every suggestion on its engineering merits before touching code.

```
TECHNICAL RIGOR & VERIFICATION OVER PERFORMATIVE AGREEMENT
```

---

## The 4-Quadrant Deliberation Pathway

Evaluate every review finding against these four technical quadrants, anchored in the [code-review-rubric.md](../requesting-code-review/code-review-rubric.md):

| Quadrant | Finding Type | Evaluation Standard | Action Pathway |
| :--- | :--- | :--- | :--- |
| **1. Correctness & Bugs** | Logic flaws, race conditions, memory leaks, missing boundary checks, broken contracts. | Objective defect. Can a failing test or concrete input break this? | Reproduce with a focused test or trace. Fix at the causal source. |
| **2. Architecture & Design** | Structural coupling, separation of concerns, API boundaries, pattern consistency. | Systemic coherence. Does this improve maintainability without over-abstraction? | Align with project design patterns. Reject speculative layers with no callers. |
| **3. Performance & Resources** | Algorithmic complexity ($O(N^2)$ on hot paths), resource leaks, redundant I/O, heavy allocations. | Measured impact. Is this on a hot path, or premature optimization on a cold path? | Verify against real scale. Optimize critical paths; preserve clarity elsewhere. |
| **4. YAGNI & Scope** | Suggesting "full-fledged" abstractions, unused endpoints, or speculative configurability. | Relevance check. Does the codebase actually need or consume this today? | Check actual call sites. If unused, remove or reject with YAGNI rationale. |

---

## Response & Execution Protocol

```
[1. Parse Requirements] ➔ [2. Verify Against Codebase Reality] ➔ [3. Technical Response / Pushback] ➔ [4. Incremental Implementation]
```

1. **Verify Against Codebase Reality**:
   - Check call sites, types, and existing test suites before implementing any suggestion.
   - If a reviewer suggests changing a signature or removing a check, verify whether external consumers or platform variants depend on it.

2. **Handle Ambiguity Before Acting**:
   - If any review item is ambiguous or underspecified, stop and clarify that specific item first. Implementing half-understood feedback creates compounding errors.

3. **Provide Reasoned Technical Pushback When Warranted**:
   - If feedback is technically incorrect, breaks platform invariants, or violates requirements:
     - State the concrete conflict with file/line evidence.
     - Cite the breaking edge case or test result.
     - Propose a sound alternative that satisfies the reviewer's underlying concern.

4. **Tone & Communication Invariants**:
   - **Eliminate performative sycophancy**: Never write *"You're completely right!"*, *"Great catch!"*, or *"My apologies"*.
   - **State technical actions directly**: *"Verifying parameter encoding in `url_builder.py`"*, *"Adding bounds check for negative offsets"*.

---

## Incremental Implementation Order

When addressing a list of review findings:
1. **Critical Bugs & Invariant Violations**: Fix first, backed by failing regression tests.
2. **Architectural & Interface Adjustments**: Modify signatures and contracts second.
3. **Refactoring & Polish**: Address naming, documentation, and cleanup last.
4. **Compile & Verification Gate**: Run the full test suite and `verification-before-completion` before reporting back.

---

## Convention Learning & Invariant Persistence Gate

When human partner feedback or code review establishes a permanent project standard (*"Always use date-fns, not dayjs"*, *"Use kebab-case for CSS custom properties"*, *"Pointers must be checked at FFI boundary"*):

1. **Verify Project Workspace Boundary**:
   - Check if currently working inside an active project (`git rev-parse --show-toplevel`).
   - If operating in a rootless scratch directory (`~`, `/tmp`, scratchpad), do **NOT** create root instruction files locally. If modifying files in an external repo, ask the user before writing to the target repo's root instructions.
2. **Persist According to the 2-Tier Hierarchy**:
   - **Project-Wide Standard**: Append a 1-line bullet to the project's active root instruction file (`AGENTS.md` or `CLAUDE.md`, whichever is used) under `## Core Invariants` (strictly maintaining the <60-line limit).
   - **Subsystem Gotcha**: Append to the domain's Tier 2 brief (`agent-docs/modules/<subsystem>.md`).
3. **Concisely Confirm**:
   - *"Recorded invariant in `AGENTS.md`: `Never use dayjs; use date-fns`."*
