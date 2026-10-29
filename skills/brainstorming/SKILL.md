---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, modifying behavior, or planning anything new, in software or out of it."
---

# Brainstorming & Technical Ideation

## 1. Intent Discovery & The First Message

Before writing code or plans, discover what is actually needed and why. Calibrate your opening message based on request intent:

| Request Intent | Opening Message Action | Output Protocol |
| :--- | :--- | :--- |
| **Advice, Opinion, or Architecture**<br>(*"What do you think?", "Should I use X?", "Recommend an architecture"*) | **Lead with Recommendation First** | State your opinionated technical recommendation, compare $\ge 2$ alternatives with trade-offs, state sensible default, and ask for user reaction. |
| **Existing UI Update / Redesign**<br>(*"Make this modal better", "Update console menu", "Redesign navigation"*) | **Invoke `hyperpowers:ui-evolution`** | 1. **Token Harvest**: Scan existing CSS/tokens (*reuse first, invent never*).<br>2. **Visual Forensics**: Diagnose failure modes; build Value Matrix.<br>3. **10/10 Critique**: 5-axis visual score ($\ge 9/10$ floor). Present mockup. |
| **New Frontend UI / Component**<br>(*"Build a new settings page", "Create audio player widget"*) | **Invoke `hyperpowers:frontend-design`** | Ground in physical domain aesthetics. Strictly ban AI visual clichés (purple SaaS gradients, Lucide card monoculture). Plan all 4 states (empty, skeleton, error, interactive). |
| **Greenfield Feature / Project**<br>(*"Build a CLI scraper", "Add Stripe checkout", "Create export service"*) | **Scope & Constraints Discovery** | Unpack intent: goals, non-goals, constraints, and success criteria. Offer recon of codebase if needed (`agent-docs/architecture.md`). Propose sensible defaults. |

---

## 2. Core Deliberation Rules

- **Recommendation First, Not Open-Ended Deflection**: When asked for advice, never deflect with a question. Give your recommendation, technical reasoning, and trade-offs first, then invite their reaction.
- **Empirical Grounding**: Ground all critiques and proposals in actual codebase facts, existing design tokens, or measurable standards (WCAG contrast, touch targets, bundle size).
- **Parallel Architectural Spikes**: When comparing $\ge 2$ competing libraries, algorithms, or external patterns requiring deep documentation/source exploration (>3 files/URLs each), invoke `hyperpowers:dispatching-parallel-agents` to run concurrent read-only research subagents (`TypeName: "research"`). Synthesize findings using the Micro-Justification Schema (<60 words) to keep parent context clean.
- **Sensible Defaults**: Propose concrete defaults in plain words. A default never mentioned is one the user cannot approve.
- **Idea Capture & Backlog**: Log out-of-scope ideas to `agent-docs/ideas.md` (`- [ ] **[Area] Title**: Description`). Reconcile and prune obsolete ideas.
- **Visual Companion**: Offer a visual companion or mockup whenever seeing layout, hierarchy, or flows clarifies requirements faster than text.

---

## 3. Work Sizing & Documentation

Once intent is established, size the work:

| Size | Description Scope | Next Step |
| :--- | :--- | :--- |
| **Quick Task** | Low-risk tweak, explicit values | Execute directly inline with verification. |
| **Small Change** | Localized feature or UI tweak | Build through standard workflow with tests/visual QA. |
| **Full Project** | Multi-step feature, new schema, or subsystem | Save design spec $\rightarrow$ Invoke `hyperpowers:writing-plans`. |

### The Written Design Document (For Projects)
Save design specifications to native artifacts (`write_to_file` in artifact directory with `IsArtifact: true`, `RequestFeedback: true`) or `docs/specs/YYYY-MM-DD-<topic>-design.md`. Cover:
- Intent, goals, non-goals, and constraints.
- Decisions made vs. sensible builder defaults.
- Inline builder check against the rubric before asking for approval.

---

## 4. The Approval Gate

<HARD-GATE>
Nothing gets built until your human partner approves the full description: in chat for small changes, or the design document for full projects.
Building includes writing product code, scaffolding, installing dependencies, and invoking implementation skills.
Reading, exploring code, and visual mockups are allowed.

After a project's design is approved, the next step is planning: invoke hyperpowers:writing-plans and no other skill.
</HARD-GATE>
