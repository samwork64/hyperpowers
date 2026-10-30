---
name: ui-verification
description: Use when visually verifying user interfaces across responsive viewports (375px, 768px, 1280px), auditing Web Interface Guidelines, or automating interactive UI flows via Chrome DevTools.
---

# UI Verification & Web Standards Audit (Stage 4: Responsive QA & Auditing)

## Overview

**Core Principle:** CSS, layout, spacing, typography, and interactive component state cannot be verified by static unit tests alone. Asserting class names in a headless DOM is **test theater**. Visual verification demands empirical pixel rendering in real viewport geometries.

Hyperpowers provides a **Dual-Engine Architecture** for visual verification:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DUAL-ENGINE VISUAL VERIFICATION                      │
├───────────────────────────────────┬────────────────────────────────────┤
│   MODE A: STATEFUL INTERACTIVE    │      MODE B: RESPONSIVE AUDIT      │
│     (Stateful UI Testing)         │     (Multi-Viewport Layout)        │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Interactive multi-step flows    │ • Fast responsive layout sanity    │
│ • Menus, drawers, forms, modals   │ • Mobile (375px) + Tablet (768px)  │
│ • Keep 1 warm session open        │ • Desktop (1440px) in 1.2 seconds  │
│ • Navigate ➔ Act ➔ Snap ➔ Repeat  │ • Zero-config bundled CLI helper   │
│ • MANDATORY: Explicit Teardown    │ • Guaranteed ephemeral exit        │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 1. Mode A: Stateful Interactive Automation (Primary Path for UI Flows)

When testing interactive components (e.g., hamburger menus, slide-in drawers, modals, multi-step wizards, accordion tabs, dynamic forms), **keep one warm browser session open** across interactions instead of restarting Chrome for every snapshot.

### The Session Lifecycle Pattern
1. **Initialize Session**: Open one headless Chrome DevTools session.
2. **Navigate & Stage**: Navigate to the target page or local dev server.
3. **Automate & Capture**: Drive user actions (click, type, toggle, wait for transitions) and capture progressive screenshots at key milestones without losing in-memory component state.
4. **Inspect State**: Query in-memory DOM, accessibility tree, or CSS styles directly over DevTools.
5. **Mandatory Teardown**: **Always close the page and terminate the browser session** before finalizing the response or declaring the task complete.

### Pattern 1: Via Chrome DevTools MCP (In MCP-Enabled Harnesses)
If the harness supports the Chrome DevTools MCP server (`chrome-devtools-mcp`):
1. **Open Page**: `navigate_page` or `new_page(url: "http://localhost:3000")`.
2. **Inspect DOM**: `take_snapshot(pageId: "...")` to inspect accessibility tree and get element UIDs.
3. **Interact**: `click(pageId: "...", uid: "...")` or `fill(pageId: "...", uid: "...", value: "...")`.
4. **Capture Milestone**: `take_screenshot(pageId: "...", filePath: "./screenshots/step-open.png")`.
5. **Repeat**: Perform subsequent interactions and capture follow-up states.
6. **Compulsory Cleanup**: Call `close_page(pageId: "...")` as soon as testing finishes.

### Pattern 2: Via Lightweight Node.js CDP Script (Universal CLI Environments)
In standard CLI environments (Claude Code, Cursor, Codex, terminal bash) without MCP tools, run a lightweight Node script utilizing native WebSocket CDP (`chrome-headless-shell` or `google-chrome --headless=new`):

```javascript
const { spawn } = require("child_process");
const fs = require("fs");

async function testInteractiveFlow(url, outDir) {
  // 1. Spawn Chrome on ephemeral port
  const chrome = spawn("chrome-headless-shell", [
    "--remote-debugging-port=0",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox"
  ], { stdio: ["ignore", "pipe", "ignore"] });

  let port = null;
  for await (const chunk of chrome.stderr) {
    const m = chunk.toString().match(/listening on ws:\/\/[^:]+:(\d+)/);
    if (m) { port = m[1]; break; }
  }

  try {
    // 2. Connect via WebSocket CDP
    const res = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
    const { webSocketDebuggerUrl } = await res.json();
    const ws = new WebSocket(webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener("open", r, { once: true }));

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const msgId = id++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === msgId) {
          ws.removeEventListener("message", handler);
          resolve(data.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await send("Page.enable");
    await send("Runtime.enable");

    // 3. Navigate & capture initial state
    await send("Page.navigate", { url });
    await new Promise((r) => setTimeout(r, 400));
    const snap1 = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${outDir}/1-initial.png`, Buffer.from(snap1.data, "base64"));

    // 4. Interactive Action: Click drawer toggle & capture open state
    await send("Runtime.evaluate", { expression: `document.querySelector('#menu-btn').click()` });
    await new Promise((r) => setTimeout(r, 300));
    const snap2 = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${outDir}/2-drawer-open.png`, Buffer.from(snap2.data, "base64"));

    // 5. Interactive Action: Select submenu item
    await send("Runtime.evaluate", { expression: `document.querySelector('#sub-item-2').click()` });
    await new Promise((r) => setTimeout(r, 300));
    const snap3 = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${outDir}/3-sub-item-active.png`, Buffer.from(snap3.data, "base64"));

    ws.close();
  } finally {
    // 6. Guaranteed Process Cleanup
    chrome.kill("SIGKILL");
  }
}
```

### Pattern 3: Direct CDP Full-Page Capture (With Infinite Scroll Clamping)
When capturing full-page views directly in headless CDP sessions or Chrome DevTools MCP, never issue a naive `captureBeyondViewport: true` screenshot. Cold layouts leave lazy-loaded images (`loading="lazy"`, `IntersectionObserver`) unrendered, and infinite-scroll feeds crash Chromium at the 16,384px texture limit.

Execute this universal pre-hydration and clamping sequence:
```javascript
// 1. Evaluate pre-hydration & detect infinite scroll
const meta = await session.evaluateCode(`(async () => {
  const getScrollHeight = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  const initialHeight = getScrollHeight();
  const vh = window.innerHeight || 800;
  const maxCap = 12000; // Cap safely below Skia 16384px texture limit
  let prevH = initialHeight, expansions = 0, isInfinite = false, y = 0;

  // Stepped pre-scroll triggers loading="lazy" & IntersectionObserver
  while (y < maxCap) {
    y += Math.floor(vh * 0.85);
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise(r => setTimeout(r, 70));
    const curH = getScrollHeight();
    if (curH > prevH + 50 && ++expansions >= 3) { isInfinite = true; break; }
    prevH = curH;
    if (y >= curH) break;
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  if (document.fonts?.ready) await document.fonts.ready;
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth),
    height: Math.min(isInfinite ? initialHeight : getScrollHeight(), maxCap),
    isInfinite
  };
})()`);

// 2. Capture native rasterization clipped to safe height
const snap = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width: meta.width, height: meta.height, scale: 1 }
});
```

---

## 2. Mode B: Ephemeral Multi-Viewport Audit (`ui-shot`)

For quick, non-interactive layout sanity across standard viewports, or when verifying static pages, landing views, and responsive styling, use the bundled zero-config utility `ui-shot.cjs`:

| Viewport Target | Dimensions | Key Audit Invariants | Expected Artifact |
| :--- | :--- | :--- | :--- |
| **Mobile** | $375 \times 812$ px | Touch targets $\ge 44 \times 44$px; zero horizontal scrolling/overflow; proper column stacking; no clipped text. | `preview-mobile.png` |
| **Tablet** | $768 \times 1024$ px | Responsive layout transitions; clean grid/flex wrap; navigation collapse; optical balance. | `preview-tablet.png` |
| **Desktop** | $1440 \times 900$ px | Max-width constraints (`max-w-7xl`); whitespace rhythm; typographic hierarchy; optical alignment. | `preview-desktop.png` |

### Multi-Viewport Command:
```bash
node <path-to-hyperpowers>/skills/ui-verification/scripts/ui-shot.cjs http://localhost:3000 ./screenshots
```
*(Captures Mobile, Tablet, and Desktop in parallel in ~1.2 seconds and exits immediately).*

### Targeted Fast Captures:
* **Full-Page Tall View (Adaptive Clamping)**: `ui-shot --full-page [--max-height 12000] http://localhost:3000 ./screenshots/fullpage.png`
  - Stepped pre-scroll hydrates lazy images and triggers `IntersectionObserver`.
  - Auto-detects infinite scroll and clamps to initial height to prevent runaway memory allocation.
  - Emits structured `[ui-shot] ℹ️ Agent Notice` in stdout to prevent hallucinated CSS bugs on sticky headers.
* **Smart Scrolling**: `ui-shot --scroll bottom http://localhost:3000 ./screenshots/footer.png`
* **Dark / Light Mode**: `ui-shot --dark http://localhost:3000 ./screenshots/dark_mode.png`

---

## 3. Mandatory 4-State Visual Coverage

Never audit only the happy path. Stage and capture all 4 states across both modes:

1. **Empty State**: Verify illustration, descriptive copy, and primary action CTA.
2. **Loading Skeleton State**: Verify skeleton geometry matches real content layout (no generic circular spinners).
3. **Error State**: Verify plain-English error explanation and functional retry button.
4. **Interactive Focus / Active State**: Verify keyboard `:focus-visible` rings and active interaction feedback.

---

## 4. Ephemeral Server & Session Lifecycle (Zero-Leak Protocol)

Prevent orphan processes, memory bloat, and port conflicts by following these invariants:

1. **Ephemeral Dev Server**: When starting a dev server solely for verification, bind its lifecycle with a shell trap:
   ```bash
   npm run dev &
   DEV_PID=$!
   trap "kill $DEV_PID 2>/dev/null" EXIT INT TERM
   until curl -s http://localhost:3000 >/dev/null 2>&1; do sleep 0.3; done
   # Run verification session or ui-shot
   kill $DEV_PID 2>/dev/null
   ```
2. **Session Cleanup Rule**: When using stateful DevTools sessions (via MCP or Node script), ensure the session is explicitly closed before completing the turn. Never leave background headless Chrome or tabs running across turns.
3. **No Heavy Desktop Browsers**: Do not spawn heavy desktop browser GUIs in the background for automated tests. Use `chrome-headless-shell` or Chrome in headless mode.

---

## 5. Web Interface Guidelines & Compliance Audit

Audit rendered interfaces against the Web Interface Guidelines (local copy: `references/guidelines.md`):

1. **Touch Targets & Hit Areas**:
   - Minimum size: $\ge 44 \times 44\text{px}$ for all touch interactive elements (buttons, links, inputs).
   - Space between targets: $\ge 8\text{px}$ to prevent accidental activation.
2. **Accessible Contrast Ratios (WCAG AA)**:
   - Body copy to background: $\ge 4.5:1$.
   - Large headings ($\ge 24\text{px}$ or bold $\ge 18.5\text{px}$): $\ge 3:1$.
   - Interactive boundaries, icons, and focus rings: $\ge 3:1$.
   - Zero washed-out low contrast text (e.g. `text-slate-400` on white).
3. **Keyboard Focus & Focus Rings**:
   - Every interactive control must display a visible, high-contrast focus ring on keyboard navigation (`:focus-visible`).
   - Standard: 2px ring with 2px offset (`focus-visible:ring-2 focus-visible:ring-offset-2`).
   - Logical tab order matching visual reading flow; Escape closes overlays.
4. **Layout Stability & Zero Horizontal Overflow**:
   - Ensure zero horizontal overflow on mobile ($375\text{px}$) with proper column stacking.
   - Zero Cumulative Layout Shift (CLS): images and dynamic components must have reserved dimensions.
   - Honor user motion preferences (`prefers-reduced-motion: reduce`).
5. **Console & Hydration Hygiene**:
   - Actively confirm **zero** unhandled console warnings, JavaScript runtime exceptions, or React hydration mismatches.
   - Report any detected failures using concise `file:line: issue` format.

---

## 6. Verification Lifecycle & Return Routing

Once visual verification and compliance audits pass:
- **During Plan Execution**: Return to `hyperpowers:executing-plans` to mark the active UI task completed (`- [x]`) and proceed to the next milestone.
- **Before Branch Finalization**: Hand off to `hyperpowers:verification-before-completion` to execute the full static syntax gate (`check-syntax.py`), test suite, and typecheck before committing or merging.
- **If Visual Defects Found**: If layout clipping, contrast failures, or missing interaction states occur, isolate the root cause via `hyperpowers:ui-evolution` (for styling adjustments) or `hyperpowers:systematic-debugging` (for broken state logic) before re-verifying.

