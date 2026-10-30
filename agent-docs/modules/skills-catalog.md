# Skills Catalog Subsystem Brief

> **Verified Commit:** `cab5e19` (2026-10-31)  
> **Tracked Source Paths:** `skills/`, `rules/AGENTS.md`

---

## 1. Domain Responsibility & Public Exports
* What this subsystem does: Maintains the 19 orthogonal engineering skills across 6 functional pillars (4-Stage UI Suite, Execution, Quality, Review, Ideation, Meta).
* Core routing interface:
  - `skills/using-hyperpowers/SKILL.md`: Master entry-point router mapping user intent to specific skills.
  - `rules/AGENTS.md`: Standing prompt kernel enforcing process adherence on Turn 0.

---

## 2. Invariants & Data Flow
* **Frontmatter Invariant**: Every `SKILL.md` must have valid YAML frontmatter with `name` and `description`.
* **Description Invariant**: `description` must start with `"Use when..."` and state triggers only, without inlining workflow summaries.
* **Progressive Disclosure**: Skills are read on demand; only names and short descriptions are available on bootstrap.

---

## 3. Non-Obvious Gotchas & Known Failure Modes
* Do not duplicate workflows across both `rules/AGENTS.md` and `skills/using-hyperpowers/SKILL.md`. Keep rules lean (<65 lines).
* When adding a new skill, register it in `skills/using-hyperpowers/SKILL.md` Capability Routing Matrix and validate via `agy plugin validate .`.
