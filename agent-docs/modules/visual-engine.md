# Visual Engine Subsystem Brief

> **Verified Commit:** `cab5e19` (2026-10-31)  
> **Tracked Source Paths:** `skills/ui-direction/`, `skills/ui-components/`, `skills/ui-evolution/`, `skills/ui-verification/`

---

## 1. Domain Responsibility & Public Exports
* What this subsystem does: Enforces the 4-Stage UI Lifecycle Suite (Direction, Components, Evolution, Verification).
* Key CLI utilities:
  - `skills/ui-verification/scripts/ui-shot.cjs`: Multi-viewport capture (375px, 768px, 1280px) and CDP automation.
  - `skills/ui-direction/scripts/search.py`: Queryable local dataset for 79 styles, 192 palettes, 74 font pairings, 119 UX guidelines.

---

## 2. Invariants & Data Flow
* **Zero Leak Invariant**: All browser processes launched via `ui-shot` must exit cleanly within ~1.2s with zero orphan renderer processes.
* **Decision Gating**: 
  - Net-new UI creation $\rightarrow$ `ui-direction` (Stage 1) $\rightarrow$ `ui-components` (Stage 2).
  - Existing UI refactoring $\rightarrow$ `ui-evolution` (Stage 3).
  - Pre-completion QA $\rightarrow$ `ui-verification` (Stage 4).
* **Multi-Viewport Gate**: UI checks must verify Mobile (375px), Tablet (768px), and Desktop (1280px) with Web Guidelines compliance (tap targets $\ge 44$px, WCAG AA contrast).
* **Anti-Test-Theater**: Never write unit tests asserting static CSS class existence; test real pixel layouts.

---

## 3. Non-Obvious Gotchas & Known Failure Modes
* When running `ui-shot` against local dev servers, verify dev server is reachable (`curl -s http://localhost:...`) before snapshotting.
* Node runtime requirements: `ui-shot.cjs` uses native CDP over WebSockets and does not require heavy browser dependencies like Puppeteer.
