# Execution Engine Subsystem Brief

> **Verified Commit:** `cab5e19` (2026-10-31)  
> **Tracked Source Paths:** `skills/executing-plans/`, `skills/writing-plans/`, `skills/dispatching-parallel-agents/`

---

## 1. Domain Responsibility & Public Exports
* What this subsystem does: Translates approved implementation plans into verified code using 3 execution modes (Hybrid, SDD, Inline).
* Core components:
  - `skills/executing-plans/SKILL.md`: Main execution loop, watchdog timers, and compaction recovery.
  - `skills/writing-plans/SKILL.md`: Task right-sizing (3–7 tasks), skill binding, and concurrency tagging.
  - `skills/dispatching-parallel-agents/SKILL.md`: Parallel batch gating and research subagents.

---

## 2. Invariants & Data Flow
* **Zero-Idle Subagent Invariant**: Never dispatch a single subagent for sequential tasks and sit idle; execute sequential tasks inline.
* **Skill Binding Invariant**: Every task must declare a bound skill (`[Skill: <name>]`) to prevent attention drift.
* **Compaction Recovery**: If the session compacts, immediately resume from the first unchecked task (`- [ ]`) in the active ledger and `git log -n 5`.

---

## 3. Non-Obvious Gotchas & Known Failure Modes
* Subagent prompts must be sliced (15–30 lines of focused brief), never passing the full implementation plan.
* Watchdog timers should be set when dispatching long-running background batches to catch network/server drops.
