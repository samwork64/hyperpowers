---
name: dispatching-parallel-agents
description: Use when facing 2+ independent implementation tasks or orthogonal research/analysis spikes that can be executed concurrently without shared state.
---

# Dispatching Parallel Agents

## Overview

**Core Principle:** Parallel subagents multiply throughput when tasks are orthogonal. If tasks touch shared mutable state, overlapping files, or cascading dependencies, parallel execution causes merge conflicts and context thrashing.

```
ANALYZE DEPENDENCY GRAPH ➔ CONFIRM ORTHOGONALITY ➔ PARALLEL DISPATCH ➔ SYNTHESIZE & VERIFY
```

---

## 1. Dependency Graph & Coupling Analysis

Before dispatching parallel subagents, evaluate the tasks against three decoupling invariants:

```
[File Disjointness?] ──(Yes)──> [Zero Shared Mutable State?] ──(Yes)──> [No Sequential Dependency?] ──(Yes)──> [PARALLEL DISPATCH]
        │                                 │                                    │
       (No)                              (No)                                 (No)
        └─────────────────────────────────┴────────────────────────────────────┴───> [EXECUTE SEQUENTIALLY]
```

1. **File & Interface Disjointness**: Do the subagents need to modify the same files or shared exported signatures?
   * *Different files/modules* $\rightarrow$ Safe for parallel dispatch.
   * *Same file* $\rightarrow$ Sequential execution to prevent file overwrite conflicts.
2. **State & Resource Isolation**: Do the tasks depend on shared database tables, ports, global singletons, or un-isolated cache keys?
   * If shared mutable state exists, run sequentially or provide isolated mock/ephemeral fixtures.
3. **Temporal Dependencies**: Does Task B require interfaces or data schemas produced by Task A?
   * If dependent, sequence them. Parallelize only tasks whose inputs and contracts are fully locked.

---

## 2. Common Orthogonal Partitioning Patterns

| Partitioning Strategy | Example Workload | Isolation Mechanism |
| :--- | :--- | :--- |
| **By Subsystem** | API route handler + Frontend view + CLI command | Completely disjoint directories and modules. |
| **By Independent Bug Cluster** | 3 unrelated test file failures in separate modules | Each subagent fixes one isolated test file. |
| **By Platform / Target** | Packaging for Debian vs Alpine vs Windows | Independent packaging scripts and Dockerfiles. |
| **By Documentation / Specs** | Writing API docs while another agent writes tutorial guides | Disjoint markdown files. |
| **By Architecture Spike (Research)** | Comparing Library A vs. Library B vs. Custom Implementation | Read-only research subagents exploring separate codebases/docs. |
| **By Causal Hypothesis (Debugging)** | Investigating Cache Invalidation vs. DB Pool Exhaustion | Read-only research subagents probing independent subsystems. |

---

## 3. Parallel Research & Investigation Protocol (Read-Only)

When deep codebase analysis or external research requires scanning large files or documentation across $\ge 2$ orthogonal domains, use parallel research subagents to prevent parent context bloat:

1. **Gating Invariant**:
   - $\ge 2$ independent subsystems or competing options.
   - Deep inspection required (>3 files or external web research each).
   - *Never* spawn a subagent for single-trace sequential debugging or quick (<3 files) lookups.
2. **Subagent Configuration**:
   - Use read-only subagents (`TypeName: "research"` or read-only tools).
   - Pass a concise prompt (<15 lines): exact question, target files/URLs, and required return schema.
3. **Structured Findings Brief Schema (<20 Lines)**:
   Mandate that subagents return strictly structured briefs:
   ```markdown
   - **Hypothesis / Option Evaluated**: [Name / Concept]
   - **Empirical Evidence**: [File paths, lines, benchmarks, API contracts]
   - **Verdict & Gotchas**: [Supported / Disproved / Trade-offs]
   ```
4. **Zero-Idle Invariant**:
   Always dispatch research agents in concurrent batches (`Subagents: [A, B]`). Never dispatch 1 research subagent and sit idle waiting for it.

---

## 4. Parallel Dispatch & Synthesis Protocol

1. **Dispatch Concurrent Subagents Across Platforms**:
   - **Antigravity**: Single `invoke_subagent` call with `Subagents: [...]` array.
   - **Claude Code**: Multiple `Agent` tool calls issued concurrently.
   - **Gemini CLI**: Multiple `invoke_agent` calls (or `@generalist` invocations) in one turn.
   - **OpenAI Codex**: Multiple `spawn_agent` calls (`fork_turns: "none"`, explicit `model` + `reasoning_effort`).
   - **Universal Fallback**: If no subagent tool exists in your runtime, sequence the tasks inline in the active session. Never invent nonexistent tools.
2. **Reconciliation & Integration**:
   - Inspect the results and git diff of each subagent upon completion.
   - Verify that changes do not create semantic conflicts or break un-isolated assumptions.
3. **Unified Verification Gate**:
   - Run the project's full build, typecheck, and test suite across the combined changes (`hyperpowers:verification-before-completion`).
