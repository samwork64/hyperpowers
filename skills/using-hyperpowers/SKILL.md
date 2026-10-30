---
name: using-hyperpowers
description: Use when starting any conversation or task to classify user intent, enforce critical deliberation, and route to specialized engineering skills.
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, ignore this skill. Focus exclusively on your assigned task instructions.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If a process skill applies to your task, you ABSOLUTELY MUST invoke it BEFORE touching code, running exploratory commands, or writing plans.
A direct user request to build, update, or fix is NOT permission to skip skills. Only skip if the user explicitly orders "skip skills" or "just code directly".
</EXTREMELY-IMPORTANT>

# Universal Prompt Triage & Capability Routing

## 1. Universal Prompt Triage Matrix

Classify incoming user prompts into operational categories and execute the mandated protocol:

| Category & Trigger | Primary Skill Flow | Deliberation & Execution Mandate |
| :--- | :--- | :--- |
| **A. Architecture / Advice**<br>*"What do you think?", "Should I use X?", "Recommend an approach"* | `hyperpowers:brainstorming` | Formulate $\ge 2$ alternatives with trade-offs. **Lead with opinionated recommendation first** using Micro-Justification Schema; ask for user reaction. |
| **B. Creating New UI**<br>*"Build new dashboard", "Create settings page", "Design audio player"* | `hyperpowers:ui-direction` $\rightarrow$ `ui-components` $\rightarrow$ `ui-verification` | **Subject Vernacular**: Ban generic SaaS clichés. Query `search.py` for domain palette/fonts. Plan all 4 states (empty, skeleton, error, interactive). Scaffold via `ui-components`, then verify viewports via `ui-verification`. |
| **C. Updating / Refactoring UI**<br>*"Make this look better", "Update modal", "Redesign navigation"* | `hyperpowers:ui-evolution` $\rightarrow$ `ui-verification` | **Token Harvesting**: Audit existing CSS/tokens first (*reuse first, extend second, invent never*). Diagnose 6 AI pitfalls. Calibrate Surface Mode (*Persuade, Operate, Read*). Score $\ge 9/10$ with mockups, then verify viewports via `ui-verification`. |
| **D. Component Scaffolding**<br>*"Add datepicker", "Build form with fields", "Create chat feed"* | `hyperpowers:ui-components` | **Primitive Composition**: Use component registry (`shadcn add`). Enforce Base UI vs Radix triggers, `FieldGroup`/`Field`, and `MessageScroller`. Zero custom markup where primitives exist. |
| **E. UI Verification & A11y Audit**<br>*"Check mobile layout", "Audit accessibility", "Verify viewports"* | `hyperpowers:ui-verification` | **Empirical QA**: Run `ui-shot.cjs` across Mobile (375px), Tablet (768px), Desktop (1280px). Audit Web Guidelines (tap targets $\ge 44$px, WCAG AA contrast $\ge 4.5:1$, focus rings). Zero console errors. |
| **F. Greenfield Feature**<br>*"Build a scraper", "Add OAuth", "Create backend service"* | `hyperpowers:brainstorming` $\rightarrow$ `hyperpowers:writing-plans` | Unpack hidden constraints, state models, and edge cases. Size the work (Task Cap: 3–7 tasks). Handoff to `writing-plans`. |
| **G. Bug / Test Failure**<br>*"Fix this error", "Why is test failing?", "Investigate regression"* | `hyperpowers:systematic-debugging` | Causal root investigation before any fix attempt. Reproduce $\rightarrow$ isolate $\rightarrow$ hypothesize $\rightarrow$ verify fix. |
| **H. Tactical / Quick Tweak**<br>*"Change padding to 12px", "Rename X to Y", "Fix typo in copy"* | Inline Execution + Link/Compile Gate | **Zero Debate**: Execute immediately. Run file-level syntax/type-check before completion. No friction for low-risk tweaks. |
| **I. Meta, Authoring & Diagnostics**<br>*"Create a new skill", "Why did session fail?", "Audit docs"* | `hyperpowers:writing-skills` / `hyperpowers:diagnosing-hyperpowers` | **Canonical Skill Anatomy**: `SKILL.md` as sole root file; guides in `references/`, scripts in `scripts/`, examples in `examples/`. TDD-driven skill pressure testing or transcript forensics with line citations. |
| **J. Workspace & Branch Isolation**<br>*"Set up worktree", "Isolate branch", "Protect working tree"* | `hyperpowers:using-git-worktrees` | Detect existing isolation; provision native worktree or git fallback. Baseline test check. |

## 2. Independent Deliberation & Anti-Sycophancy
- **Anti-Sycophancy**: Never blindly follow flawed or duplicative instructions. Lead with the superior engineering path.
- **Micro-Justification Schema (<60 words)**: Eliminate conversational fluff. Output structured rationale:
  `- **Verdict**: [Optimal / Suboptimal / Duplicative]`  
  `- **Why & Trade-offs**: [Empirical justification: existing tokens, performance, WCAG]`  
  `- **Recommended Default**: [Opinionated path forward]`

## 3. Capability Routing Matrix (The 19-Skill Suite)

| Intent / Phase | Primary Skill | Core Invariant |
| :--- | :--- | :--- |
| **Ideation & Architecture** | `hyperpowers:brainstorming` | Clarify intent & trade-offs before building. Lead with recommendation. |
| **Stage 1: New UI Direction** | `hyperpowers:ui-direction` | Domain-anchored aesthetics, search.py styles/palettes, 4-state coverage. |
| **Stage 2: Component Architecture** | `hyperpowers:ui-components` | Primitive composition, registry scaffolding (`shadcn add`), forms, chat. |
| **Stage 3: UI Evolution & Craft** | `hyperpowers:ui-evolution` | Token harvesting (zero redundant CSS), 6 AI pitfalls, craft floor, 10/10 critique. |
| **Stage 4: UI Verification & QA** | `hyperpowers:ui-verification` | Dual-engine QA: Chrome DevTools interactive + ui-shot viewports + Web Guidelines. |
| **Implementation Planning** | `hyperpowers:writing-plans` | Atomic tasks (cap: 3–7), domain verification, native plan artifacts. |
| **Plan Execution** | `hyperpowers:executing-plans` | Hybrid default (inline sequential, parallel subagent batches). Zero-idle. |
| **Parallel Tasks** | `hyperpowers:dispatching-parallel-agents` | Dispatch concurrent subagents only when files/state are fully decoupled. |
| **Workspace Isolation** | `hyperpowers:using-git-worktrees` | Provision isolated worktrees or native branches; baseline verification. |
| **Debugging & Errors** | `hyperpowers:systematic-debugging` | Isolate causal root before editing; circuit breaker at 2 failed fixes. |
| **Logic & Dynamic Contracts** | `hyperpowers:test-driven-development` | Strict Red-Green-Refactor. Reject test theater for static code/CSS. |
| **Completion Verification** | `hyperpowers:verification-before-completion` | File syntax sanity (`check-syntax.py`) + tests + build + visual check. |
| **Requesting Review** | `hyperpowers:requesting-code-review` | Fast inline self-review against 6-axis rubric before marking complete. |
| **Receiving Review** | `hyperpowers:receiving-code-review` | 4-quadrant deliberation; push back on flawed/hallucinated review points. |
| **Branch Finalization** | `hyperpowers:finishing-a-development-branch` | Clean tree tests, ideas backlog reconciliation, PR/merge options. |
| **Living Architectural Memory** | `hyperpowers:managing-agent-docs` | Subsystem briefs in `agent-docs/` + drift guard + ideas backlog. |
| **Skill Authoring & TDD** | `hyperpowers:writing-skills` | Test-driven skill design, pressure testing, frontmatter invariants. |
| **Session Diagnostics** | `hyperpowers:diagnosing-hyperpowers` | Transcript log forensics, line-level evidence, failure isolation. |
| **Prompt Triage Router** | `hyperpowers:using-hyperpowers` | Universal intent classification, criticality gating, subagent rules. |

## 4. Subagent Discipline & Zero-Idle Invariant
- **Concurrent Throughput**: Dispatch subagents ONLY for $\ge 2$ decoupled, independent tasks (`Subagents: [...]`) or background context isolation.
- **Zero-Idle Invariant**: **NEVER** dispatch a single subagent for a sequential task and sit idle waiting for it. Execute sequential tasks inline for instant velocity and zero token waste.
- **Platform Reference**: See `references/` (`antigravity-tools.md`, `claude-code-tools.md`, `codex-tools.md`, `gemini-tools.md`, `hermes-tools.md`, `muse-tools.md`, `pi-tools.md`, `default-tools.md`) for runtime tool adapters.

## 5. 2-Tier Subsystem Memory & Just-in-Time Protocol

To eliminate Turn-0 prompt bloat while preserving architectural context across sessions:

1. **JIT Subsystem Briefs (`agent-docs/modules/<name>.md`)**:
   - When modifying an existing subsystem (e.g. `execution-engine`, `visual-engine`, `skills-catalog`), read its module brief Just-in-Time before writing code.
   - Verify the `Verified Commit` SHA in the brief against `HEAD`:
     ```bash
     git diff --name-only <VERIFIED_COMMIT>..HEAD -- <TRACKED_SOURCE_PATHS>
     ```
   - If files have changed, refresh the brief opportunistically.
2. **Active Ideas Backlog (`agent-docs/ideas.md`)**:
   - Out-of-scope architectural concepts, suggested commands, or deferred features captured during brainstorming or reviews are logged to `agent-docs/ideas.md` (`- [ ] **[Area] Title**: Description`).
   - Prune items as soon as they are implemented or superseded.
3. **Branch Finalization**:
   - Always run `hyperpowers:finishing-a-development-branch` before merging to reconcile ideas, update commit SHAs, and verify a clean working tree.
