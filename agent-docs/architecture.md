# Hyperpowers Architecture Overview

> **Repository:** Hyperpowers Plugin  
> **Tech Stack:** Markdown, Python (syntax/evals), Node.js (CDP visual verification), Shell  
> **Last Verified Commit:** `cab5e19` (2026-10-31)

---

## 1. Directory Map
* `rules/` - Turn-0 standing operating kernel (`rules/AGENTS.md`) injected into agent prompts.
* `skills/` - 19 orthogonal capabilities across 6 pillars (4-Stage UI Suite, Execution, Quality, Review, Ideation, Meta).
* `agent-docs/` - Living architectural memory, module briefs, and ideas backlog.
* `assets/` - Brand icons and imagery.

---

## 2. Core Entry Points & Bootstrapping
* **Turn-0 Invariant Bootstrap**: `rules/AGENTS.md` (mandates skills before code, blast zones, zero-idle).
* **Master Triage Router**: `skills/using-hyperpowers/SKILL.md` (classifies intents A–J across 19 skills).
* **4-Stage UI Suite**: `ui-direction` (Stage 1), `ui-components` (Stage 2), `ui-evolution` (Stage 3), `ui-verification` (Stage 4).
* **Design Intelligence Engine**: `skills/ui-direction/scripts/search.py` (queryable local dataset).
* **Visual QA Engine**: `skills/ui-verification/scripts/ui-shot.cjs` (ephemeral CDP multi-viewport).
* **Master Execution Engine**: `skills/executing-plans/SKILL.md` (Hybrid, SDD, Inline modes).
* **Syntax Sanity Gate**: `skills/verification-before-completion/scripts/check-syntax.py`.

---

## 3. Essential Commands & Verification
* **Validate Plugin**: `agy plugin validate .`
* **Syntax Sanity Gate**: `python3 skills/verification-before-completion/scripts/check-syntax.py --all`
* **Run Test Suite**: `pytest`
* **Sync to Live Install**:
  `cp -r skills/ rules/ README.md agent-docs/ plugin.json pytest.ini ~/.gemini/config/plugins/hyperpowers/ && agy plugin validate ~/.gemini/config/plugins/hyperpowers`

---

## 4. Key Architectural Invariants
* **Rules Cap**: `rules/AGENTS.md` strictly capped at `<65 lines` to prevent Turn-0 prompt bloat.
* **Zero Path Leaks**: Never commit machine-specific paths (`/home/`, `/Users/`).
* **Zero-Idle Invariant**: Never dispatch a single subagent for sequential tasks; run inline.
* **Empirical Verification**: Never declare completion without fresh verification evidence.
