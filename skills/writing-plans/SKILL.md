---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans & Task Decomposition

## Overview

Transform requirements into clear, bite-sized implementation tasks. Structure plans so that independent tasks can run in parallel while sequential tasks flow without friction.

```
SPEC / DESIGN ➔ DECOMPOSE INTO ATOMIC TASKS ➔ IDENTIFY CONCURRENCY (PARALLEL VS SEQUENTIAL) ➔ SAVE PLAN ARTIFACT ➔ HANDOFF
```

---

## 1. Platform-Adaptive Plan Storage & Anti-Duplication Rule

1. **Storage Mechanism by Platform**:
   - **Native Artifact Platforms (e.g. Antigravity)**: Save directly as a native **Plan / Task Artifact** (`write_to_file` in artifact directory with `IsArtifact: true`, `ArtifactMetadata.ArtifactType: "task"`). Do not pollute the repository with scratch plan files.
   - **Native Plan Mode / Todo Platforms (e.g. Claude Code, Gemini CLI)**: Initialize native plan mode or structured task tracking (`TodoWrite`, `enter_plan_mode`, `tracker_create_task`).
   - **Default Tooling (OpenAI Codex, Cursor, Copilot, OpenCode, Aider, generic CLI)**: Save to project plan directory: `docs/plans/YYYY-MM-DD-<feature-name>.md` (or `.plans/<feature-name>.md`).
2. **Zero Textual Duplication (Universal Invariant)**:
   - Do **NOT** dump the full textual plan into the chat response before or after saving it. The plan is stored in its dedicated tool, artifact, or file. Point the user directly to the plan location with a concise 2-sentence summary of key architectural decisions and execution options.

---

## 2. Context Discovery & Agent-Docs Pre-Check

Before reading dozens of raw source files:
1. **System Orientation**: Check `agent-docs/architecture.md` (if present) to identify existing conventions, entry points, and directory boundaries.
2. **Subsystem Invariants**: Check `agent-docs/modules/<subsystem>.md` for the domain being touched. Run the 1-second drift check (`git diff --name-only <VERIFIED_COMMIT>..HEAD -- <paths>`). If clean, trust the contracts directly; if dirty, inspect the delta.
3. **Idea Reconciliation**: If `agent-docs/ideas.md` contains an item relevant to this feature, incorporate it into the plan tasks so it gets implemented and pruned upon branch finalization.

---

## 3. Task Right-Sizing & Concurrency Tagging

Organize tasks so the execution engine knows what can run concurrently:

| Concurrency Tag | Task Characteristics | Execution Target |
| :--- | :--- | :--- |
| **`[Sequential]`** | Modifies core interfaces, migrations, or shared foundation that subsequent tasks depend on. | Executed directly inline by the coordinator agent. |
| **`[Parallel Batch N]`** | Independent tasks that touch disjoint files and have zero shared mutable state (e.g., separate scrapers, isolated test files, disjoint views). | Dispatched concurrently to parallel subagents. |

### Plan Atomicity & Task Cap Rule (Token & Drift Guard)
* **Task Cap**: Limit implementation plans to **3 to 7 atomic tasks**.
* **Phased Milestone Splitting**: If a feature requires >8 tasks, do **NOT** write a monolithic mega-plan. Sprawling plans exhaust context tokens, cause agents to hallucinate step boundaries, and invite compounding drift. Split into phased milestones (e.g., `Phase 1: Backend Foundation`, `Phase 2: UI & Views`). Execute and verify Phase 1 before planning Phase 2.

---

## 4. Plan Document Structure

Every plan artifact should follow this high-density layout:

```markdown
# [Feature Name] Implementation Plan

> **Goal:** [One clear sentence describing what is built]  
> **Architecture:** [2-3 sentences on technical approach and domain boundaries]  
> **Tech Stack:** [Core technologies, libraries, and frameworks]  
> **Blast Radius & Rollback:** [Risk level; specific rollback command if migration or destructive action fails]

## Concurrency & Execution Map
- **Phase 1 [Sequential]**: Core schema / foundational interfaces (Task 1).
- **Phase 2 [Parallel Batch 1]**: Independent modules (Tasks 2A, 2B, 2C) — Depends on: Task 1.
- **Phase 3 [Sequential]**: Integration, wiring, and verification (Task 3) — Depends on: Phase 2.

---

## Tasks

### Task 1: [Sequential] [Task Name]
**Dependencies:** None  
**Files:**
- Create: `path/to/file.py`
- Test: `tests/path/to/test.py`

- [ ] **Step 1**: Write failing test / define contract.
- [ ] **Step 2**: Implement minimal code.
- [ ] **Step 3**: Verify test passes (`pytest tests/path/to/test.py`) & commit.

### Task 2A: [Parallel Batch 1] [Task Name]
**Dependencies:** Depends on Task 1  
**Files:**
- Create: `tools/scraper_a.py`
- [ ] **Step 1**: Implement scraper for source A.
- [ ] **Step 2**: Verify output (`python tools/scraper_a.py --test`) & commit.

### Task 2B: [Parallel Batch 1] [Task Name]
**Dependencies:** Depends on Task 1  
**Files:**
- Create: `tools/scraper_b.py`
- [ ] **Step 1**: Implement scraper for source B.
- [ ] **Step 2**: Verify output (`python tools/scraper_b.py --test`) & commit.
```

---

## 5. Domain Verification Templates

Select task steps based on the **failure mode**:

### A. Logic & Contract Tasks (TDD)
* Dynamic calculations, data transformations, URL generators with parameters, state machines, API routes.
* Red-Green-Refactor: failing test first $\rightarrow$ minimal code $\rightarrow$ verify pass $\rightarrow$ commit.
* Mandatory exact test command: e.g. `pytest tests/test_billing.py -k test_checkout`.

### B. UI & Presentation Tasks (Visual Verification)
* Styling, layout, HTML/JSX, responsive flow.
* No unit tests for static text or CSS classes.
* Multi-viewport inspection via `ui-shot` (Mobile 375px, Tablet 768px, Desktop 1280px+) + 0 console errors.
* Mandatory exact capture command: e.g. `ui-shot http://localhost:3000/orders ./screenshots`.

### C. Static & Maintenance Tasks (Compile & Link Gate)
* URL fixes, config updates, typo fixes.
* Link check (`curl -sI`) + compiler/typecheck gate (`tsc --noEmit`, `py_compile`). Zero unit tests needed.

---

## 6. Execution Handoff

After saving the plan, present the execution approach clearly to the user:

> *"Plan complete and saved to `[plan location]`. Which execution approach would you prefer?"*
> 
> 1. **Hybrid (Recommended / Default)**: Sequential tasks run natively inline for speed and interactive control; orthogonal tasks are dispatched concurrently in parallel to subagents (or inline if subagents unavailable).
> 2. **Native Inline Only**: All tasks executed directly in this session. Fastest, zero subagent overhead.
> 3. **Full Subagent Isolation (SDD)**: Fresh subagent per task in an isolated workspace with independent review gates.
