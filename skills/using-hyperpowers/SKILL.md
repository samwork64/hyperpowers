---
name: using-hyperpowers
description: Master entry-point router for all user prompts - classifies intent, enforces critical deliberation, and routes to specialized engineering skills.
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

Classify incoming user prompts into one of five operational categories and execute the mandated protocol:

| Category & Trigger | Primary Skill Flow | Deliberation & Execution Mandate |
| :--- | :--- | :--- |
| **A. Architecture / Advice**<br>*"What do you think?", "Should I use X?", "Recommend an approach"* | `hyperpowers:brainstorming` | Formulate $\ge 2$ alternatives with trade-offs. **Lead with opinionated recommendation first** using Micro-Justification Schema; ask for user reaction. |
| **B. UI Evolution / Redesign**<br>*"Make this look better", "Update modal", "Redesign navigation"* | `hyperpowers:ui-evolution` + `hyperpowers:frontend-design` | **Token Harvesting**: Audit existing CSS/tokens first (*reuse first, invent never*). **10/10 Critique**: 5-axis visual score ($\ge 9/10$ floor). Propose mockups. |
| **C. Greenfield Feature**<br>*"Build a dashboard", "Add OAuth", "Create new CLI command"* | `hyperpowers:brainstorming` $\rightarrow$ `hyperpowers:writing-plans` | Unpack hidden constraints, state models, and edge cases. Size the work (Task Cap: 3–7 tasks). Handoff to `writing-plans`. |
| **D. Bug / Test Failure**<br>*"Fix this error", "Why is test failing?", "Investigate regression"* | `hyperpowers:systematic-debugging` | Causal root investigation before any fix attempt. Reproduce $\rightarrow$ isolate $\rightarrow$ hypothesize $\rightarrow$ verify fix. |
| **E. Tactical / Quick Tweak**<br>*"Change padding to 12px", "Rename X to Y", "Fix typo in copy"* | Inline Execution + Link/Compile Gate | **Zero Debate**: Execute immediately. Run file-level syntax/type-check before completion. No friction for low-risk tweaks. |

## 2. Independent Deliberation & Anti-Sycophancy
- **Anti-Sycophancy**: Never blindly follow flawed or duplicative instructions. Lead with the superior engineering path.
- **Micro-Justification Schema (<60 words)**: Eliminate conversational fluff. Output structured rationale:
  `- **Verdict**: [Optimal / Suboptimal / Duplicative]`  
  `- **Why & Trade-offs**: [Empirical justification: existing tokens, performance, WCAG]`  
  `- **Recommended Default**: [Opinionated path forward]`

## 3. Capability Routing Matrix

| Intent / Phase | Primary Skill | Core Invariant |
| :--- | :--- | :--- |
| **Ideation & Architecture** | `hyperpowers:brainstorming` | Clarify intent & trade-offs before building. Lead with recommendation. |
| **New UI Aesthetics** | `hyperpowers:frontend-design` | Domain-anchored aesthetics, semantic tokens, 4-state coverage. |
| **Existing UI 10/10 Evolution** | `hyperpowers:ui-evolution` | Token harvesting (zero redundant CSS), visual forensics, 10/10 mockups. |
| **Searchable Styles/Palettes** | `hyperpowers:ui-ux-pro-max` | 79 styles, 192 product palettes, 74 font pairings via `search.py`. |
| **Component Scaffolding** | `hyperpowers:shadcn` | Component composition, registry discovery (`shadcn add`), presets. |
| **Visual QA & Automation** | `hyperpowers:visual-verification` | Stateful Chrome DevTools sessions for UI flows + `ui-shot` multi-viewport. |
| **Implementation Planning** | `hyperpowers:writing-plans` | Atomic tasks (cap: 3–7), domain verification, native plan artifacts. |
| **Plan Execution** | `hyperpowers:executing-plans` | Hybrid default (inline sequential, parallel subagent batches). Zero-idle. |
| **Parallel Tasks** | `hyperpowers:dispatching-parallel-agents` | Dispatch concurrent subagents only when files/state are fully decoupled. |
| **Debugging & Errors** | `hyperpowers:systematic-debugging` | Isolate causal root before editing; circuit breaker at 2 failed fixes. |
| **Logic & Dynamic Contracts** | `hyperpowers:test-driven-development` | Strict Red-Green-Refactor. Reject test theater for static code/CSS. |
| **Completion Verification** | `hyperpowers:verification-before-completion` | File syntax sanity (`check-syntax.py`) + tests + build + visual check. |
| **Code Review** | `hyperpowers:receiving-code-review` / `requesting-code-review` | 4-quadrant deliberation; fast inline self-review against 6-axis rubric. |
| **Branch Finalization** | `hyperpowers:finishing-a-development-branch` | Clean tree tests, ideas backlog reconciliation, PR/merge options. |
| **Living Architectural Memory** | `hyperpowers:managing-agent-docs` | Subsystem briefs in `agent-docs/` + drift guard + ideas backlog. |

## 4. Subagent Allocation & Zero-Idle Invariant
- **Concurrent Throughput**: Dispatch subagents ONLY for $\ge 2$ decoupled, independent tasks (`Subagents: [...]`) or background context isolation.
- **Zero-Idle Invariant**: **NEVER** dispatch a single subagent for a sequential task and sit idle waiting for it. Execute sequential tasks inline for instant velocity and zero token waste.
- **Platform Reference**: See `references/antigravity-tools.md`, `claude-code-tools.md`, or `default-tools.md` for runtime tool adapters.
