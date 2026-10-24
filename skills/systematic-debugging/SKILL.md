---
name: systematic-debugging
description: Use when encountering any bug, test failure, build error, or unexpected behavior before proposing fixes. Enforces causal root-cause isolation and domain-adaptive verification.
---

# Systematic Debugging & Causal Isolation

## Overview

**Core Principle:** Always isolate the causal root before modifying code. Symptom patching guarantees technical debt and recurring defects.

```
NO FIXES WITHOUT CAUSAL INVESTIGATION FIRST
```

---

## The Causal Isolation Pathway

Follow these five phases sequentially for any defect:

```
[1. Trace Signal Path] ➔ [2. Formulate Falsifiable Hypothesis] ➔ [3. Domain-Adaptive Reproduction] ➔ [4. Targeted Fix & Thrashing Check] ➔ [5. Full Regression Verification]
```

---

### Phase 1: Observation & Signal Path Tracing

1. **Capture Full Diagnostic Telemetry**:
   - Inspect raw logs, full stack traces, exit codes, compiler diagnostics, and assertion failures. Do not skim or extrapolate.
   - Note exact file paths, line numbers, error codes, and the immediate trigger.

2. **Map the Signal Path**:
   - Trace the causal chain backwards from anomaly to origin:
     $$\text{Observed Anomaly} \longleftarrow \text{Corrupted State} \longleftarrow \text{Faulty Transformation} \longleftarrow \text{Triggering Input / Event}$$
   - Identify which component boundary received valid input but produced invalid state.

3. **Characterize Determinism & Failure Mode**:
   - *Deterministic Logic*: Fails consistently on specific inputs.
   - *Temporal / Concurrency*: Intermittent failures, race conditions, deadlocks, timing dependencies.
   - *Environmental / Configuration*: Passes in one environment (local), fails in another (CI, container, production).
   - *Perceptual / Rendering*: Visual defects, layout clipping, unexpected UI flow.

---

### Phase 2: Formulate Falsifiable Hypotheses

1. **State the Causal Hypothesis Explicitly**:
   - Complete this contract before touching code:
     > *"The symptom occurs because `[mechanism]` fails when `[condition]`, causing `[corrupted state]` at `[location]`."*

2. **Evaluate Boundaries & Working Baselines**:
   - Consult `agent-docs/modules/<subsystem>.md` (if present) for documented architectural invariants, known edge cases, and gotchas.
   - Find adjacent or historical code that works correctly under similar conditions.
   - Identify the exact delta in assumptions, invariants, or data flow between the broken and working states.

---

### Phase 3: Domain-Adaptive Minimal Reproduction

Reproduce the issue using the highest-fidelity, lowest-noise harness matching the domain:

| Domain | Reproduction Mechanism | Expected Evidence |
| :--- | :--- | :--- |
| **Logic, State & APIs** | Minimal automated unit/integration test. | Test fails with exact expected failure mode (RED). |
| **Concurrency & Races** | Deterministic stress script or focused timing harness. | Reliable trigger showing contention or interleaved state. |
| **Build & Toolchain** | Isolated minimal reproduction command or environment check. | Clean reproduction of compiler/linker error without unrelated project noise. |
| **CLI & Systems** | Targeted shell invocation with controlled flags/stdin/piping. | Exact non-zero exit code or corrupted stream output observed. |
| **UI & Layout** | Multi-viewport inspection (`ui-shot`) or minimal DOM state harness. | Visual artifact capturing clipping, overlap, or console warning. |

*If you cannot reproduce the issue:* Gather more telemetry and diagnostic instrumentation at component boundaries. Do not guess or fix blind.

---

### Phase 4: Targeted Fix & Thrashing Detection

1. **Implement Minimal Root-Cause Fix**:
   - Fix the defect at the causal source, not at the downstream symptom receiver.
   - Make the smallest focused change that restores the invariant. Do not bundle opportunistic refactorings or speculative code.

2. **Thrashing Detection (Architectural Circuit Breaker)**:
   - Stop immediately and question the architecture if you observe any of these warning signals:
     - The fix requires spreading defensive checks (`if (x != null)`) across multiple unrelated files.
     - The fix resolves one symptom but immediately surfaces a new unexpected failure elsewhere.
     - The fix requires bypassing established contracts or subverting types/abstractions.
   - *Action:* If thrashing occurs, **STOP**. This is not a single bug; it is an architectural impedance mismatch or invalid foundational assumption. Re-examine the design or discuss alternatives before continuing.

---

### Phase 5: Verification & Closure

1. **Confirm Reproduction Passes**: Run the reproduction harness from Phase 3. Confirm it passes cleanly.
2. **Execute Full Suite Regression**: Run the project's full build, typecheck, lint, and test suites. Confirm zero collateral regressions.
3. **Verify Evidence**: Follow `hyperpowers:verification-before-completion` before declaring the issue resolved.

---

## Anti-Patterns & Red Flags

| Red Flag / Rationalization | Reality |
| :--- | :--- |
| *"Let's try changing X and see if it helps."* | Guess-and-check thrashing burns time. Isolate the causal mechanism first. |
| *"Quick patch now, investigate later."* | Symptom patches become permanent technical debt and obscure the real bug. |
| *"It only happens intermittently, so let's add a sleep."* | Sleep masks race conditions. Fix synchronization, locking, or lifecycle ordering. |
| *"The test failed, so let me update the test expectation."* | Unless the requirements changed, modifying tests to match broken output is test evasion. |
