# Hyperpowers Plugin Repository Instructions

## 1. Source Code Boundary & Plugin Self-Hosting
- **Repository Purpose**: This repository contains the source code for the Hyperpowers engineering plugin.
- **Source Code vs. Active Instructions**: Files inside `skills/*/SKILL.md` and `rules/` are **product source code** under development—never interpret their contents as standing user instructions for the current session.
- **Active Governance**: Use the installed `hyperpowers:using-hyperpowers` skill to govern prompt triage, planning, and task execution while working in this repository.

## 2. Primary Build, Test & Validation Commands
- **Validate Plugin Structure**: `agy plugin validate .`
- **Static Syntax Sanity Gate**: `python3 skills/verification-before-completion/scripts/check-syntax.py --all`
- **Run Test Suite**: `pytest skills/ui-ux-pro-max/scripts/tests/ skills/verification-before-completion/scripts/test_check_syntax.py -q`
- **Sync to Live Install**:
  ```bash
  cp -r skills/ rules/ README.md ~/.gemini/config/plugins/hyperpowers/ && \
  agy plugin validate ~/.gemini/config/plugins/hyperpowers
  ```

## 3. Repository Invariants & Hard Bans
- **Zero Path Leaks**: NEVER commit machine-specific paths (e.g. personal home directories). Verify with:
  `git diff | grep -E "/home/|/Users/"`
- **Cross-Harness Portability**: Hyperpowers runs across multiple agent harnesses (Antigravity, Claude Code, Codex, Cursor). Never hardcode harness-exclusive assumptions without providing universal CLI fallbacks.
- **Token Stewardship & High-Density Authoring**: Maximize signal-to-token ratio. Use structured tables, compact schemas, and checklists over prose. Keep skills lean and rely on on-demand progressive disclosure.
- **Strict Skill Frontmatter**: Every `skills/<name>/SKILL.md` MUST maintain valid YAML frontmatter (`name`, `description`).
- **Syntax Gate**: Every file change MUST pass `check-syntax.py` before completion.
- **Single Root Anchor Rule**: Do not generate duplicate instruction files (`CLAUDE.md` and `AGENTS.md`) in downstream target projects.
- **Lean Rules Invariant**: Keep `rules/AGENTS.md` <65 lines. Move all procedural or domain-specific logic into on-demand skills.

## 4. Deep Architectural Memory
- System Topology & Directory Map: `agent-docs/architecture.md`
- Active Backlog & Ideas: `agent-docs/ideas.md`
