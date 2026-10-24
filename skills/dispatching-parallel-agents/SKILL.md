---
name: dispatching-parallel-agents
description: Use when facing 2+ independent tasks that can be worked on concurrently without shared state, file conflicts, or sequential dependencies.
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

---

## 3. Parallel Dispatch & Synthesis Protocol

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
