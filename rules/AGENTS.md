# Hyperpowers for Web Applications

@../skills/using-hyperpowers/SKILL.md

When operating in web application projects (frameworks such as Next.js, React, Vue, Svelte, Angular, Astro, Vite, or web backends like Node/Express, FastAPI, Django, Flask):

## 1. Skill Invocations for Web Apps

### A. 4-Stage Frontend UI/UX Pipeline
Follow this pipeline whenever designing, creating, or modifying user interfaces:
1. **Stage 1: Direction & Aesthetics** (`frontend-design`):
   - Invoke alongside `hyperpowers:brainstorming`.
   - **Ban AI Visual Clichés**: Strictly ban generic purple/indigo-to-cyan SaaS gradients (`from-indigo-500 to-teal-400`), the "Lucide-icon-in-a-gray-box" card monoculture, pastel "Trust-Me" badges, tracked-out ALL-CAPS eyebrow labels, and robotic buzz-copy (*"Streamline your workflow"*).
   - Ground aesthetics in the physical subject matter vernacular (retro consoles, financial terminals, editorial publishing, developer CLI).
   - Curate a deliberate 4–6 color palette using semantic theme tokens (`bg-background`, `text-foreground`, `border-border`, `bg-primary`). Never use washed-out gray-on-gray text (`text-slate-400` on white is banned).
2. **Stage 2: Design Intelligence & Multi-State Ergonomics** (`ui-ux-pro-max` + `shadcn`):
   - Use `ui-ux-pro-max` for curated palettes, typography scales, responsive layout patterns, and tech-stack guidelines.
   - **Mandatory 4-State Coverage**: Never design only the happy path. Explicitly implement:
     - *Empty state*: Helpful illustration/copy + direct CTA button.
     - *Loading state*: Layout-accurate skeleton loader matching real geometry (no generic spinners).
     - *Error state*: Plain-English explanation + retry action.
     - *Interaction states*: Hover, active, disabled, and high-visibility `:focus-visible` rings for keyboard accessibility.
   - Use `shadcn` for component composition and design system architecture. Prefer semantic tokens over hardcoded Tailwind utility classes.
3. **Stage 3: Judgment-First Verification (Logic TDD vs. Visual Verification vs. Compile Gate)**:
   - **Evaluate the Real Failure Mode First**:
     - *Dynamic Logic & Contracts (TDD)* (`hyperpowers:test-driven-development`): Apply to functions that compute, transform schemas, generate URLs with parameters, or manage state. Test the real contract: parameter encoding, boundary edge cases, and schema conformity.
     - *Visual Layout & Responsive Flow (Visual Verification)*: Apply to CSS/Tailwind styling, layout spacing, typography, theme colors, and responsive flow. Verify visually in real viewports via `ui-shot`. Avoid unit tests that merely assert static DOM nodes or text exist (test theater).
     - *Static URLs, Copy & Maintenance (Compile & Link Gate)*: Apply to static link corrections, typo fixes, copy adjustments, and configuration changes. Zero unit tests needed. Verify with static analysis (`tsc`, `py_compile`, `eslint`) and link reachability (`curl -sI`).
   - **Universal Build Invariant**: Every change, regardless of category, must pass compilation, type-check, and lint passes before completion.
4. **Stage 4: Multi-Viewport Visual Auditing & Craft Polish** (`web-design-guidelines` + `impeccable`):
   - **Multi-Viewport Visual Gate**: Run `ui-shot <url> ./screenshots` to capture and inspect:
     - **Mobile** (375px - 414px): Check touch target sizes (≥ 44×44px), zero horizontal overflow, proper column stacking, no text clipping (`preview-mobile.png`).
     - **Tablet** (768px - 834px): Check navigation collapse, grid/flex wrapping, and responsive layout transitions (`preview-tablet.png`).
     - **Desktop** (1280px+): Check max-width constraints, optical balance, whitespace rhythm, and typographic scale (`preview-desktop.png`).
   - **Scrolled & Full-Page Verification**:
     - `ui-shot` automatically waits for full page readiness (`loadEventFired` + `networkidle` + `document.fonts.ready`).
     - For landing pages or tall views: `ui-shot --full-page <url> ./screenshots/fullpage.png`
     - For footers or scrolled states: `ui-shot --scroll bottom <url> ./screenshots/footer.png` (smart multi-pass scroll handles window, nested overflow containers, and disables CSS smooth-scroll delay).
     - For targeted scroll: `ui-shot --scroll "#element-id" <url>` or `ui-shot --scroll-y 1200 <url>`.
   - **Interactive State, Custom Evaluation & Direct CDP**:
     - Execute DOM actions before snapshot: `ui-shot --eval 'document.querySelector("#btn").click()' <url>`
     - Send raw CDP methods directly: `ui-shot --cdp 'Emulation.setEmulatedMedia:{"media":"print"}' <url>`
     - Multiple `--eval` and `--cdp` flags can be chained to stage complex UI states before capturing.
   - **Visual Quality & Cleanliness**: Check alignment, WCAG 4.5:1 contrast, optical rhythm, and micro-interactions (hover, focus, active, disabled).
   - **Interactive Smoke & Console Check**: Actively verify states and confirm zero unhandled console warnings, errors, or hydration mismatches.

### B. General Web App Architecture & Planning
- **New Features & UI Components**: Always invoke `hyperpowers:brainstorming` before writing code or planning.
  - When asked for guidance, advice, or suggestions, lead with your engineering recommendation, architectural trade-offs, and sensible defaults first, then ask for their opinion.
  - Clarify client vs. server component architecture (e.g., React Server Components vs. client interactive components).
  - Clarify layout, responsive breakpoints (mobile/tablet/desktop), accessibility (WCAG/ARIA), and state management (local vs. store vs. URL query parameters).
- **Implementation Planning**: Use `hyperpowers:writing-plans`.
  - Break down web features into ordered, isolated layers: Database schema/migrations -> Backend API endpoints -> Data fetching/hooks -> UI components -> Page composition -> E2E flows.
  - **Plan Atomicity & Task Cap**: Limit implementation plans to **3 to 7 atomic tasks**. If a feature requires >8 tasks, split into phased milestones (Phase 1, Phase 2) to prevent context token exhaustion and compounding drift.
  - Categorize tasks dynamically based on failure mode: **Logic Tasks** (TDD for algorithms, state, dynamic contracts), **UI Tasks** (multi-viewport visual checks via `ui-shot`), and **Static/Config Tasks** (compile/typecheck & link verification). Reject test theater.
- **Dynamic Verification Selection**:
  - **Targeted Test Execution Rule**: Run the **targeted test file** during the inner TDD cycle (RED-GREEN-REFACTOR). Run the full broad suite only during the outer completion gate to save 80–90% of cycle latency and avoid log context flooding.
  - **TDD for Dynamic Behavior**: Apply unit tests to functions with computation, dynamic URL generation with parameters, data mapping, state reducers, or complex branch logic.
  - **Reject Test Theater**: Never write unit tests that merely assert static text, constants, or declarative CSS styles exist.
  - **Always Compile & Type-Check**: Ensure all modified files pass `tsc`, `py_compile`, or `eslint` after changes.
  - **Avoid Arbitrary Timeouts**: Use condition-based waiting (`waitFor`, polling signals) instead of fixed `sleep`/`setTimeout` to prevent flaky async tests.
  - **Log Output Density & Noise Reduction**: Use quiet flags by default (`pytest -q`, `cargo test -- -q`). Never dump 1,000+ lines of raw stdout into context. Filter for errors (`tail -n 50`) on non-zero exit codes.
- **Debugging Web Issues**: Use `hyperpowers:systematic-debugging`.
  - For hydration mismatches, CORS errors, broken layout, or console warnings: reproduce with a minimal script or visual inspection first, isolate root cause, test hypotheses, and verify fix before committing.
- **Verification Before Completion**: Run `hyperpowers:verification-before-completion`.
  - Verify type checks: `npx tsc --noEmit` or language equivalent.
  - Verify linting: `npm run lint` or `eslint`.
  - Verify test suite: `npm test` / `vitest run` / `pytest` for logic regressions.
  - Verify build: `npm run build` / `vite build` without errors or asset warnings.
  - Verify visual UX: Multi-viewport check via `ui-shot` and clean browser console.

## 2. Process Hygiene & Zero-Leak Verification Protocol

Prevent orphan processes, memory bloat, and port conflicts by following these invariants:

1. **Visual Verification Tooling**:
   - **Paved Path**: Always use `ui-shot` (backed by `chrome-headless-shell` with ephemeral CDP). It executes in ~1 second, frees 100% of memory on exit, and leaves zero background processes or tabs.
   - Do NOT launch full desktop browsers (Brave, Firefox) in the background for screenshots, as their renderer and GPU helper processes leak gigabytes of RAM.
2. **Ephemeral Dev Servers (Verification Only)**:
   - When launching a dev server solely to capture screenshots or run visual tests, bind its lifecycle to the command using a trap or process group:
     ```bash
     npm run dev &
     DEV_PID=$!
     trap "kill $DEV_PID 2>/dev/null" EXIT
     until curl -s http://localhost:3000 >/dev/null; do sleep 0.5; done
     ui-shot http://localhost:3000 ./screenshots
     kill $DEV_PID 2>/dev/null
     ```
3. **Persistent Dev Servers (Development Mode)**:
   - Before launching a dev server for user interaction, check whether a process is already listening on the target port (`ss -tulpn | grep :<port>` or `lsof -i :<port>`).
   - If a dev server is already running on the expected port, reuse it. Do not spawn duplicate instances that cascade onto ports 3001, 3002, 5174, etc.
4. **Interactive Browser Tabs (`browser-mcp`)**:
   - When interactive user testing in Chrome is needed via `browser-mcp`, always call `browser_close_tab` as soon as the test or data extraction is finished. Never leave tabs open across agent turns.

## 3. Antigravity Tool Mappings
- **Planning**: Use built-in `/plan` slash command or plan/task artifacts (`write_to_file` in artifact directory) rather than writing ad-hoc files to the repository. **Zero Textual Duplication**: never dump full plan text into the chat.
- **Subagents & Zero-Idle Invariant**: Use `invoke_subagent` for concurrent parallel batches (`Subagents: [...]`) or heavy background execution. **NEVER** dispatch a single subagent for a sequential task and sit idle waiting for it. Perform code reviews inline against the rubric in seconds. Slice and pass **ONLY** the 15–30 line task brief to implementers, never the full implementation plan.
- **Task Tracking**: Use task artifacts via `write_to_file` (`IsArtifact: true`, `ArtifactMetadata.ArtifactType: "task"`) and update with `replace_file_content`. (`manage_task` is for background shell processes only).

## 4. Configuration & Settings Resolution (`hyperpowers.json`)

Hyperpowers supports dynamic runtime overrides via configuration files, environment variables, or natural language prompts while preserving resilient built-in defaults:

1. **Resolution Precedence**:
   `Environment Variables (HYPERPOWERS_*)` $\rightarrow$ `Project Config (hyperpowers.json or .hyperpowers/config.json)` $\rightarrow$ `Global Config (~/.config/hyperpowers/config.json)` $\rightarrow$ `Built-in Defaults`.
2. **Key Configurable Options**:
   - `execution.mode`: `"hybrid"` (default) | `"sdd"` | `"inline"`.
   - `execution.taskCap`: Max tasks per plan before milestone splitting (default: `7`).
   - `execution.watchdogTimeoutSeconds`: Subagent watchdog liveness timer (default: `450`).
   - `debugging.circuitBreakerThreshold`: Consecutive failed fix attempts before halting (default: `2`).
   - `testing.targetedInnerLoop`: Test only active file on inner loop (default: `true`).
   - `testing.quietByDefault`: Apply quiet flags by default to prevent log dumping (default: `true`).
   - `visual.viewports`: Custom dimensions for Mobile, Tablet, and Desktop viewports.
   - `telemetry`: Enable/disable external badge requests (default: `false`).
3. **Natural Language Settings Configuration**:
   When the user instructs you via chat to adjust a default (e.g. *"Set default execution mode to inline"*, *"Increase task cap to 10"*, or *"Use 414px for mobile viewports"*):
   - Update or create `hyperpowers.json` (or `.hyperpowers/config.json`) in the project root adhering to `hyperpowers.schema.json`.
   - Confirm the updated configuration to the user and adhere to it for all subsequent operations.

