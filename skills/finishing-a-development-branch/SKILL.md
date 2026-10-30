---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests and builds pass, and you need to integrate or finalize the branch.
---

# Finishing a Development Branch

## Overview

**Core Principle:** Integration occurs only after full verification. Detect repository workflow, verify working tree cleanliness, and present clear integration options.

```
VERIFY TESTS & BUILD ➔ VERIFY TREE CLEANLINESS ➔ PRESENT INTEGRATION OPTIONS ➔ EXECUTE & CLEANUP
```

---

## The Integration Protocol

### Step 1: Full Suite Verification
Run the project's comprehensive test and build command (`cargo test`, `npm test && npm run build`, `pytest`, `go test ./...`).
* **If any verification fails**: Report failures and resolve them before proceeding. Never merge or PR broken code.
* **If green**: Proceed to Step 2.

### Step 2: Working Tree Hygiene
Ensure the git working directory is clean:
```bash
git status --porcelain
```
If uncommitted files remain, commit or stash them before proceeding.

### Step 3: Identify Base Branch & Environment
* Determine base branch (`main`, `master`, or feature parent) from upstream tracking or git history:
  ```bash
  BASE_BRANCH=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "main")
  ```

### Step 4: Root Invariants & Agent-Docs Maintenance Gate
Maintain persistent architectural memory before merging:
1. **Audit Tier 1 Root Invariant (Dynamic Resolution)**:
   - Identify the project's single active root instruction file (`AGENTS.md`, `CLAUDE.md`, or `.cursorrules`):
     ```bash
     ROOT_FILE=$(ls AGENTS.md CLAUDE.md .cursorrules 2>/dev/null | head -n 1)
     ```
   - Did this feature introduce a toolchain/command shift or establish a project-wide architectural invariant?
   - If yes: Update the detected root file (or create `AGENTS.md` / `CLAUDE.md` based on active harness). Strictly enforce the **<60-line limit** and zero-bloat admission gate. Never create duplicate root files.
2. **Update Tier 2 Subsystem Briefs**:
   - Determine which subsystem was modified (e.g. `src/billing/` $\rightarrow$ `agent-docs/modules/billing.md`).
   - If `agent-docs/modules/<subsystem>.md` exists: Update contracts, exports, and gotchas to reflect the new implementation. Stamp with current commit:
     `> **Verified Commit:** [HEAD_SHA] (YYYY-MM-DD)`
   - If a new architectural subsystem was created: Create a focused 30–50 line brief in `agent-docs/modules/<subsystem>.md`.
3. **Reconcile Ideas Backlog**:
   - Check `agent-docs/ideas.md`.
   - Identify if this feature implemented, superseded, or invalidated any active backlog item.
   - Delete resolved or superseded items from `ideas.md` to maintain zero token waste.
4. **Commit Maintenance Updates**:
   ```bash
   git add "${ROOT_FILE:-AGENTS.md}" agent-docs/ 2>/dev/null && git commit -m "docs: update root invariants & subsystem topology" 2>/dev/null || true
   ```

### Step 5: Present Integration Options
Present the integration choices clearly to the user:
1. **Merge Locally**: Checkout base branch, pull latest, merge the feature branch, and verify tests on merged HEAD.
2. **Push & Create Pull Request**: Push feature branch to remote origin and open a PR via `gh pr create` or web link.
3. **Retain Branch**: Keep branch as-is for future manual review or staged release.

### Step 6: Execute Choice & Clean Up
* **Merge Locally**:
  ```bash
  git checkout "$BASE_BRANCH" && git pull
  git merge --no-ff <feature-branch>
  # Run verification gate on merged HEAD
  ```
* **PR Creation**:
  ```bash
  git push -u origin HEAD
  gh pr create --fill || echo "Branch pushed to origin"
  ```
* **Worktree Pruning**: If working in a git worktree (`git worktree list`), return to the main repo root before removing the worktree:
  ```bash
  git worktree remove <worktree-path>
  ```
