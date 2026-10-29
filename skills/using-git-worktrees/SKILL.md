---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - ensures an isolated workspace exists via native tools or git worktree fallback
---

# Using Git Worktrees & Workspace Isolation

## Overview

**Core Principle:** Ensure work happens in an isolated workspace. Detect existing isolation first $\rightarrow$ Use native platform tools $\rightarrow$ Fall back to git worktrees. Never fight the harness.

---

## 1. Isolation Protocol

```
[0. DETECT ISOLATION] ➔ [1. NATIVE TOOL OR GIT WORKTREE] ➔ [2. SETUP] ➔ [3. BASELINE VERIFY]
```

### Step 0: Detect Existing Isolation & Submodules
```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
IS_SUBMODULE=$(git rev-parse --show-superproject-working-tree 2>/dev/null)
```
- **If `GIT_DIR != GIT_COMMON` and not a submodule**: Already in an isolated worktree. Skip to Step 2.
- **If in a normal checkout**: Ask user consent unless previously declared:
  > *"Would you like me to set up an isolated worktree to protect your current branch?"*

### Step 1: Provision Isolated Workspace
1. **1a. Native Worktree Tool (Preferred)**: If your platform has a native tool (`EnterWorktree`, `WorktreeCreate`, `/worktree`), use it immediately. It manages placement and cleanup automatically.
2. **1b. Git Worktree Fallback (Only if no native tool exists)**:
   - **Target Directory**: Use `.worktrees/` (default) or existing `worktrees/`.
   - **Safety Check**: Must verify directory is git-ignored:
     ```bash
     git check-ignore -q .worktrees 2>/dev/null || (echo ".worktrees/" >> .gitignore && git commit -am "chore: ignore .worktrees")
     ```
   - **Creation**:
     ```bash
     git worktree add ".worktrees/$BRANCH_NAME" -b "$BRANCH_NAME"
     ```
   - **Tool Policy Invariant**: When executing commands inside the worktree, use your tool's directory argument (e.g. `Cwd: ".worktrees/$BRANCH_NAME"`) or inline command chaining (`cd ... && ...`). **NEVER propose or execute a standalone bare `cd` command.**
   - **Sandbox Fallback**: If permissions block worktree creation, work in the current repository directory.

### Step 2: Project Setup
Detect and install dependencies:
- **Node.js**: `[ -f package.json ] && npm install`
- **Python**: `[ -f requirements.txt ] && pip install -r requirements.txt` (or `poetry install` / `uv sync`)
- **Rust / Go**: `cargo build` / `go mod download`

### Step 3: Baseline Verification
Run the project's test command (`npm test`, `pytest`, `cargo test`). Confirm a clean passing baseline before writing feature code.

---

## 2. Decision Matrix & Rationalization Defense

| Situation | Correct Action | Why Critical |
| :--- | :--- | :--- |
| **Already in linked worktree** | Skip to Step 2 | Prevents nested phantom worktrees. |
| **Inside a git submodule** | Treat as normal repo | `GIT_DIR != GIT_COMMON` is true in submodules. |
| **Native tool exists** | Use native tool first | Harness cannot manage raw `git worktree add` state. |
| **Directory not ignored** | Add to `.gitignore` first | Prevents committing entire worktree into git history. |
| **Baseline test fails** | Report & pause | Ambiguous baseline ruins debugging later. |
| **Bare `cd` command** | Use `Cwd` or `cd && ...` | Prevents Antigravity tool policy violations. |
