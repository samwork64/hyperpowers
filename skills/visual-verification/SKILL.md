---
name: visual-verification
description: Empirical multi-viewport visual testing and layout verification using bundled zero-leak CDP runner (ui-shot). Audits responsive layouts, CSS overflow, typography, and interactive UI states.
---

# Visual Verification: Multi-Viewport Inspection & UI Auditing

## Overview

**Core Principle:** CSS, layout, spacing, typography, and responsive flows cannot be verified by unit tests. Asserting class names in a headless DOM is **test theater**. Visual verification demands empirical pixel rendering in real viewport geometries.

```
SPAWN EPHEMERAL SERVER ➔ MULTI-VIEWPORT CDP CAPTURE ➔ AUDIT LAYOUT & ARTIFACTS ➔ ZERO-LEAK CLEANUP
```

---

## 1. The Multi-Viewport Inspection Gate

Every UI change must be audited across three standard viewports:

| Viewport Target | Dimensions | Key Audit Invariants | Expected Artifact |
| :--- | :--- | :--- | :--- |
| **Mobile** | $375 \times 812$ px | Touch targets $\ge 44 \times 44$px; zero horizontal scrolling/overflow; proper column stacking; no clipped text. | `preview-mobile.png` |
| **Tablet** | $768 \times 1024$ px | Responsive layout transitions; clean grid/flex wrap; navigation collapse; optical balance. | `preview-tablet.png` |
| **Desktop** | $1440 \times 900$ px | Max-width constraints (`max-w-7xl`); whitespace rhythm; typographic hierarchy; optical alignment. | `preview-desktop.png` |

---

## 2. Bundled Zero-Leak Tooling (`ui-shot.cjs`)

Hyperpowers bundles a standalone, zero-dependency CDP runner that communicates directly with headless Chrome, Chromium, Edge, or Brave:

### Basic Multi-Viewport Suite (Captures all 3 viewports in ~1 second):
```bash
node <path-to-hyperpowers>/skills/visual-verification/scripts/ui-shot.cjs http://localhost:3000 ./screenshots
```
*(If installed on PATH as `ui-shot`, you may simply run: `ui-shot http://localhost:3000 ./screenshots`)*

### Targeted Captures:
* **Full-Page Tall View (Landing pages, long articles)**:
  ```bash
  ui-shot --full-page http://localhost:3000 ./screenshots/fullpage.png
  ```
* **Smart Scrolling (Footers, nested overflow containers)**:
  ```bash
  ui-shot --scroll bottom http://localhost:3000 ./screenshots/footer.png
  ui-shot --scroll "#pricing" http://localhost:3000 ./screenshots/pricing.png
  ui-shot --scroll-y 1200 http://localhost:3000 ./screenshots/middle.png
  ```
* **Theme & Color Scheme Emulation**:
  ```bash
  ui-shot --dark http://localhost:3000 ./screenshots/dark_mode.png
  ui-shot --light http://localhost:3000 ./screenshots/light_mode.png
  ```
* **Interactive State Staging (Clicking tabs, opening modals)**:
  ```bash
  ui-shot --eval 'document.querySelector("#mobile-menu-btn").click()' http://localhost:3000 ./screenshots/mobile-menu.png
  ```
* **Raw CDP Emulation**:
  ```bash
  ui-shot --cdp Emulation.setEmulatedMedia:'{"media":"print"}' http://localhost:3000 ./screenshots/print-layout.png
  ```

---

## 3. Ephemeral Server Lifecycle (Zero-Leak Protocol)

When running a local development server solely for visual verification, bind its lifecycle with a trap to prevent orphan processes and port conflicts:

```bash
# 1. Start dev server in background
npm run dev &
DEV_PID=$!
trap "kill $DEV_PID 2>/dev/null" EXIT INT TERM

# 2. Poll until server responds
until curl -s http://localhost:3000 >/dev/null 2>&1; do sleep 0.3; done

# 3. Capture multi-viewport screenshots
node <path-to-hyperpowers>/skills/visual-verification/scripts/ui-shot.cjs http://localhost:3000 ./screenshots

# 4. Clean up server immediately
kill $DEV_PID 2>/dev/null
```

---

## 4. Visual Quality Checklist

When reviewing captured screenshots:
1. **Zero Horizontal Overflow**: Ensure no element forces the viewport width to expand horizontally on mobile.
2. **Typography & Readability**: Ensure body text has comfortable line height ($\ge 1.4$) and line length (<75 characters).
3. **Contrast Compliance**: Check text against background (WCAG AA 4.5:1 minimum). Never accept washed-out gray on white.
4. **Console Hygiene**: Confirm zero unhandled console warnings, JavaScript exceptions, or hydration mismatches during capture.
