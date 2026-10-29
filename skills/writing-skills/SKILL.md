---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment
---

# Writing Skills: Test-Driven Process Documentation

## Overview

**Writing skills IS Test-Driven Development applied to documentation.**
If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing.

```
[RED: Pressure Baseline Fails] ➔ [GREEN: Minimal Skill Passes] ➔ [REFACTOR: Plug Loopholes] ➔ [VERIFY & DEPLOY]
```

---

## 1. TDD Mapping for Skills

| TDD Concept | Skill Authoring | Objective |
| :--- | :--- | :--- |
| **Test Case** | Pressure scenario with subagent | Create realistic temptation to bypass process. |
| **Test Fails (RED)** | Baseline agent violates rule | Record exact rationalizations used verbatim. |
| **Minimal Code (GREEN)** | Minimal skill (`SKILL.md`) | Address specific observed failure modes. |
| **Test Passes** | Agent complies with skill loaded | Verify agent adheres to all required invariants. |
| **Refactor** | Close new loopholes discovered | Re-test until compliance is bulletproof. |

---

## 2. Skill Directory & File Structure

```
skills/<skill-name>/
├── SKILL.md              # Main reference & triggers (required)
├── references/           # Heavy reference (>100 lines, API tables, schemas)
├── scripts/              # Reusable execution tools & validation scripts
└── templates/            # Prompt templates & standardized reports
```

### SKILL.md Frontmatter Rules
- `name`: Lowercase letters, numbers, and hyphens only (e.g. `using-hyperpowers`).
- `description`: Max 1024 chars. **Starts with "Use when..." describing triggering conditions only.**
- **SDO Invariant**: **NEVER summarize the skill's workflow in `description`**. Summaries create shortcuts where agents execute the description while ignoring the skill body and its gates.

---

## 3. Authoring Guidelines & Anti-Rationalization

### A. Match Guidance Form to the Failure Mode
- **Cognitive Load Failure** (agent forgets a step): Use an ordered **Checklist**.
- **Conceptual Gap** (agent misjudges situation): Use a **Decision Table** or **Mental Model**.
- **Temptation / Shortcuts** (agent rationalizes skipping): Use a **Hard Rule (`<HARD-GATE>`)** + **Red Flags Table**.

### B. The Spirit vs. Letter Invariant
> **"Violating the letter of the rules is violating the spirit of the rules."**  
> Cuts off all *"I'm following the spirit"* rationalizations.

### C. Rationalization Defense Table
Every rationalization observed during baseline testing must be cataloged:

| Observed Rationalization | Reality & Counter-Measure |
| :--- | :--- |
| *"This change is too simple to test"* | Simple code breaks silently. Targeted tests take 15 seconds. |
| *"I'll write tests after implementation"* | Tests-after verify "what code does"; tests-first specify "what code should do". |
| *"I need to explore the codebase first"* | Skills tell you HOW to explore without thrashing. Check skills first. |
| *"User instructions override skills"* | User precedence applies ONLY when user explicitly orders *"skip skills"*. |

---

## 4. The RED-GREEN-REFACTOR Cycle

### Step 1: RED (Run Baseline Without Skill)
1. Formulate 3+ pressure scenarios (time pressure, sunk cost, authority pressure).
2. Run scenarios with a subagent **WITHOUT** the new skill.
3. Record exact rationalizations, skipped steps, and failure symptoms verbatim.

### Step 2: GREEN (Write Minimal Skill)
1. Write minimal `SKILL.md` directly plugging the observed baseline violations.
2. Keep it dense, structured, and free of narrative fluff.
3. Micro-test wording (5+ reps against a no-guidance control).
4. Run pressure scenarios **WITH** the skill. Verify agent complies.

### Step 3: REFACTOR (Plug Loopholes)
1. Capture any new rationalizations that emerged.
2. Add explicit counters to the Red Flags table. Re-test until airtight.

---

## 5. Anti-Patterns to Strictly Ban

- ❌ **Narrative Storytelling**: *"In session 2025-10-03, we noticed that..."* (Wastes tokens, not reusable).
- ❌ **Unrenderable `.dot` Graphviz**: Use native Mermaid (`mermaid`) or Markdown tables.
- ❌ **Platform Hardcoding**: Never hardcode harness-specific variables (`${CLAUDE_...}`). Use portable paths.
- ❌ **Multi-Language Dilution**: Provide one excellent example rather than 5 half-baked languages.

---

## 6. Mandatory Skill Deployment Checklist

Create a tracking todo for each item before deploying:

- [ ] **RED**: Baseline pressure scenarios executed; failure symptoms documented verbatim.
- [ ] **GREEN**: Frontmatter has `name` (hyphenated) and `description` (triggers only, no workflow summary).
- [ ] **GREEN**: Guidance matches failure mode (checklists, decision tables, or hard gates).
- [ ] **REFACTOR**: Red flags table captures all observed rationalizations.
- [ ] **Quality**: Zero narrative fluff; all diagrams use native Mermaid or Markdown.
- [ ] **Portability**: Zero hardcoded paths; scripts runnable across all agent harnesses.
- [ ] **Validation**: Passes `agy plugin validate .` and `check-syntax.py`.
- [ ] **Commit**: Committed to version control and synchronized to active plugin directory.
