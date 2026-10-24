# [Subsystem Name] Subsystem Brief

> **Verified Commit:** `[COMMIT_SHA]` ([YYYY-MM-DD])  
> **Tracked Source Paths:** `[PATH_1]`, `[PATH_2]`

---

## 1. Domain Responsibility & Public Exports
* What this subsystem does: [1-2 sentences on core domain capability].
* Primary entry point / exported interfaces:
  - `export function executeTask(...)`: [contract summary].
  - `export class SubsystemManager`: [lifecycle role].

---

## 2. Invariants & Data Flow
* [Invariant 1: e.g. "Tokens expire after 15 minutes; refresh must be thread-safe"].
* [Invariant 2: e.g. "All database mutations occur within a managed transaction"].

---

## 3. Non-Obvious Gotchas & Known Failure Modes
* Gotcha 1: [e.g. "Header X must be lower-case in test environment"].
* Gotcha 2: [e.g. "Third-party webhook requires raw body for HMAC verification; do not parse JSON before signature check"].
