---
name: ui-evolution
description: "Use when updating, refactoring, redesigning, or polishing existing user interfaces. Enforces design token harvesting (zero redundant CSS), visual defect forensics, 10/10 aesthetic self-critique with visual mockups, and dual interactive/visual verification."
---

# UI Evolution & 10/10 Self-Critique Protocol

## Overview

**Core Principle:** Refactoring an existing UI is an evolutionary discipline, not a greenfield rewrite. Preserve brand truth, eliminate visual friction, and reuse established components. Never generate code that merely "compiles" while looking like a 5/10 amateur prototype.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE 5-PHASE UI EVOLUTION LIFECYCLE                   │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: TOKEN HARVEST      ➔ Scan existing CSS, components, variables │
│                                (Reuse first, extend second, invent 0)  │
│ PHASE 2: VISUAL FORENSIC    ➔ Diagnose why it's 5/10 & build Value     │
│                                Justification Matrix ("Why & Benefit")  │
│ PHASE 3: 10/10 SELF-CRITIQUE➔ Generate mockups, score across 5 axes;   │
│                                iterate until score ≥ 9/10              │
│ PHASE 4: TOKEN REUSE BUILD  ➔ Implement using harvested tokens         │
│ PHASE 5: DUAL VERIFICATION  ➔ Chrome DevTools: Visual QA + Interactive │
│                                State Machine Functional Tests          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Design System & Token Harvest (Anti-Duplication Gate)

Before proposing or writing a single line of CSS, execute a static scan of existing project styles:

1. **Design Tokens**: Audit `tokens.css`, `tailwind.config`, `globals.css`, and CSS custom properties:
   - Surface & background tokens (`--bg-surface`, `--bg-surface-glass`, `--bg-canvas`).
   - Accent & gradient tokens (`--accent-cyan`, `--accent-grad`, `--space-grad`).
   - Border, radius, and glow tokens (`--border-subtle`, `--radius-lg`, `--glow-cyan`).
2. **Signature Reusable Components**: Inspect existing buttons, badges, cards, and blur tracks:
   - *Floating controls*: e.g. `button.btn-scroll-to-top` (unboxed blur chevron).
   - *Pills & Badges*: e.g. `.badge-rating`, `.hero-badge-pill`, status indicators.
   - *Cards & Containers*: e.g. `.system-hero-card`, glassmorphic backdrops.
3. **The Cardinal Invariant**: **Reuse first, extend second, invent never**. Every new UI element must adopt existing CSS classes and variables. Banned: inventing redundant parallel classes (e.g. creating `.custom-modal-btn` when `.btn-hero-primary` or `.btn-pill` already exists).

---

## Phase 2: Visual Forensic & Value Justification Matrix

Diagnose why the incumbent UI feels unpolished (5/10) by auditing against the **6 Classic AI UI Pitfalls**:

| Pitfall / Anti-Pattern | Root Cause in AI Code | 10/10 Resolution Standard |
| :--- | :--- | :--- |
| **1. The Unparsed Data Wall** | Raw backend fields dumped directly (e.g. repeating `GLOBAL / UNKNOWN` 10 times). | Parse parenthetical tags, clean names, and filenames into human-friendly badges. Stack vertically on mobile. |
| **2. Confusing / Fake Metrics** | Multiplying scores or adding stars to plain numbers (e.g. `★ 94` reading as 94 stars). | Adopt established badge standards (`★ 8.8 / 10`). Omit badge cleanly if unrated; never fabricate mock scores. |
| **3. Competing Action Chaos** | Placing dual primary CTAs side-by-side, causing decision paralysis. | Consolidate into a single, high-contrast, full-width primary CTA with clear intent. |
| **4. Broken Placeholder Flooding** | Generating redundant fallback SVGs for every missing image asset. | Strict asset hierarchy (`Artwork > Title > Gameplay`). Omit missing tiles; show at most 1 typographic fallback. |
| **5. Abrupt Dead Voids** | Premature linear gradients creating harsh black cuts at container bottoms. | Implement smooth, continuous ambient backdrops and frosted glass vignettes across the entire scroll area. |
| **6. Gesture & Scroll Bleed** | Modal touch gestures scrolling the background catalog underneath. | Enforce scroll locking (`overflow: hidden` on body) and touch isolation (`overscroll-behavior: contain`). |

### Mandatory Value Justification Table
Before modifying any layout, summarize changes in this concise table:
| Current UI Friction / Defect | Proposed 10/10 Fix | User Benefit & Why It's a Good Idea | Reused Existing Token / Component |
| :--- | :--- | :--- | :--- |

---

## Phase 3: Visual Concept Generation & 10/10 Self-Critique Loop

1. **Generate Visual Mockups**:
   - In Antigravity: Use `generate_image` to render realistic Mobile ($9:16$) and Desktop ($16:9$) concepts.
   - In CLI harnesses: Render lightweight HTML/CSS preview sandboxes or capture snapshots via Chrome DevTools.
2. **The 10-Point Objective Critique Rubric (0–2 points each)**:

| Axis | Criterion | Full Points (2 pts) | Defect (0–1 pts) |
| :--- | :--- | :--- | :--- |
| **1. Focal Point & Hierarchy** | Clear visual hierarchy; the eye immediately knows what matters. | Clear hero stage, logical reading flow, zero cluttered noise. | Flat wall of cards, competing buttons, no distinct focal point. |
| **2. Brand & Token Cohesion** | Indistinguishable from the parent application's best views. | Reuses existing tokens, fonts, materials, and signature controls. | Looks like an alien template or ad-hoc style injection. |
| **3. Atmospheric Craft & Contrast** | Depth, tactile materials, and accessible typography. | Balanced lighting, frosted glass depth, WCAG AA $\ge 4.5:1$ contrast. | Flat dull gray, washed-out low contrast, or harsh cutoffs. |
| **4. Data Presentation Integrity** | Clean, honest, human-friendly data representation. | Parsed tags, clean labels, zero fake ratings or mock strings. | Unparsed database strings, `GLOBAL / UNKNOWN` repetitions. |
| **5. Mobile Ergonomics & Tap Targets** | Built for touch devices and thumb-zone interaction. | Targets $\ge 44\times 44\text{px}$, vertical stacking on mobile, zero overflow. | Cramped 2-column mobile grids, awkward tiny tap zones. |

3. **The Quality Floor**: **Minimum threshold is $9 / 10$**. If total score is $<9$, identify the failing axis, adjust choices, and refine before presenting to the user.
4. **Multi-Variant Option Presentation**: If a legitimate architectural or visual trade-off exists (e.g. *Option A: Floating Minimalist Sheet* vs. *Option B: High-Density Retro Gaming HUD*), generate and present both for the user to choose.

---

## Phase 4: Implementation with Reused Tokens

- Implement changes strictly mapped to harvested CSS classes, variables, and components.
- Do not write repetitive CSS blocks when a utility class or existing design system token accomplishes the goal.

---

## Phase 5: Dual Verification (Look & Work)

Never stop at visual appearance. A 10/10 UI must function seamlessly:

1. **Visual Layout Verification**:
   - Capture multi-viewport suite (Mobile $375\text{px}$, Tablet $768\text{px}$, Desktop $1440\text{px}$) via Chrome DevTools or `ui-shot`.
   - Verify zero horizontal overflow, proper text wrapping, and clean contrast.
2. **Interactive State Machine QA (Headless Chrome DevTools Session)**:
   - Keep 1 persistent session open to verify interactive behaviors:
     - *Sheet Dismiss / Collapse*: Clicking close or collapse controls triggers animation and resets state.
     - *Dynamic Text Clamping*: Expanding "Read more" measures container height without layout jumping.
     - *State Switching*: Clicking variant/edition chips updates active classes and downstream payloads.
     - *Touch Isolation*: Confirm modal gestures do not bleed into background scrolling.
   - **Compulsory Cleanup**: Explicitly terminate the session before completing the turn.
