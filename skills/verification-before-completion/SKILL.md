---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs. Requires running fresh verification commands and confirming evidence before making any success claims.
---

# Verification Before Completion

## Overview

**Core Principle:** Evidence before claims, always. Never assert a task is complete, a bug is fixed, or a build is clean without fresh, un-cached empirical evidence.

```
NO COMPLETION CLAIMS WITHOUT FRESH EMPIRICAL EVIDENCE
```

---

## The Verification Protocol

Before declaring any task or phase complete, follow this 4-step gate:

```
[1. Identify Ground-Truth Proof] ➔ [2. Execute Fresh Verification] ➔ [3. Inspect Full Output & Exit Code] ➔ [4. Correlate with Invariants]
```

1. **Identify the Ground-Truth Command**: Determine what command or inspection tool directly verifies the contract (not a proxy or secondary assumption).
2. **Execute Freshly**: Run the command in the current environment. Never rely on previous runs, assumptions, or "should work" extrapolations.
3. **Inspect Entire Output**: Check return exit codes, error streams, compiler warnings, and test counts.
4. **Correlate with Acceptance Invariants**: Ensure the output proves the exact requirement, not merely that a command completed without crashing.

### 0. The File-Level Syntax Sanity Gate (Mandatory Pre-Flight)
Before running high-level test suites or declaring completion:
Execute the bundled zero-dependency syntax verification script across all modified files:
```bash
python3 skills/verification-before-completion/scripts/check-syntax.py
```
* **Why this is critical**: Test suites frequently execute only targeted modules. Un-imported files, secondary helpers, configuration JSONs, or conditionally executed code can harbor silent syntax errors (unmatched quotes, bad indentation, unclosed brackets, broken JSON commas, shell syntax errors) while tests falsely report green.
* **Language Coverage**: Automatically checks Python (`ast.parse`), JSON (`json.loads`), Shell (`bash -n`), JavaScript (`node --check`), TOML, and YAML.
* **Zero Latency**: Executes in $<100\text{ms}$ with pure standard library tooling.
* **Invariant**: Never claim a task is complete or say *"we are good to go"* if `check-syntax.py` exits with non-zero. Fix all file-level parse errors immediately.

### Log Output Density & Noise Reduction Rule (Context Guard)
When executing verification commands on large codebases:
* **Avoid Raw Log Flooding**: Never dump thousands of lines of verbose build/test stdout directly into the context. Excessive output exhausts context windows and displaces active instructions.
* **Quiet Flags by Default**: Prefer quiet/concise flags during regression passes (e.g. `pytest -q`, `npm test -- --silent`, `cargo test -- -q`).
* **Surgical Failure Inspection**: If a verification command fails (non-zero exit code), inspect targeted error tails (`tail -n 50`) or filter for failures (`grep -E "FAIL|ERROR|error\["`) rather than dumping megabytes of compilation logs into the conversation context.

---

## Multi-Domain Verification Matrix

Apply the verification standard tailored to the project domain:

| Domain | Required Evidence | Insufficient Proxy (Anti-Pattern) |
| :--- | :--- | :--- |
| **Logic & Services** | Automated test suite passes with 0 failures (`pytest`, `npm test`, `cargo test`, `go test ./...`). | Code edited in editor; mock-only test with no real assertions. |
| **CLI & Tools** | Exit code 0 on success; distinct non-zero exit codes on bad inputs; clean `stdout` vs `stderr` separation; pipe compatibility. | Command printed help text; assumption that script runs without error. |
| **Systems & Native** | Clean compilation with zero compiler warnings (`-Wall`), zero sanitizer violations (ASan/TSan), and clean typechecks. | Linter passed (linter does not verify compilation or memory safety). |
| **Libraries & SDKs** | Public export types compile cleanly (`tsc --noEmit`, `mypy`), package bundles without warnings, and backward compatibility is preserved. | Internal tests pass but exported index types are broken. |
| **Client UI & Web** | Chrome DevTools interactive session (for stateful menus, modals, forms) or multi-viewport check via `ui-shot` (Mobile 375px, Tablet 768px, Desktop 1280px+); interactive click/state verification; **zero** console errors/warnings. | "CSS looks right in editor"; unit tests pass while UI is clipped or overflowing. |
| **Configuration & Ops** | Schema validation clean, service health endpoint returns 200, environment variables load with expected defaults. | Config file syntax highlighted cleanly in editor. |

---

## Universal Build & Static Analysis Invariant

Regardless of domain, **every** code change must satisfy static validation before completion:
* **Compilation / Typecheck**: `tsc --noEmit`, `cargo check`, `go build`, `python3 -m py_compile`, etc.
* **Linting / Formatting**: `eslint`, `flake8`, `ruff`, `golangci-lint`, etc.
* **Full Regression Suite**: Broad test suite remains green with zero regressions.
* **Living Memory Audit**: If subsystem interfaces, schemas, or behaviors were altered, update `agent-docs/modules/<subsystem>.md` with current contracts and advance the `Verified Commit` SHA.

---

## CI Quota & Cost Protection Invariants

Continuous Integration consumes shared billable minutes. Enforce strict runner economy before modifying or completing CI configurations:

1. **Default to Single Fast Linux Runner**:
   - Automated push and pull_request workflows MUST execute on `ubuntu-latest` with dependency caching (`setup-python` cache, `actions/cache`).
   - Standard CI runs must execute fast Tier 1 unit tests only and complete in $<30$ seconds.
2. **Multi-OS Matrix Gating (The 10× Cost Multiplier Rule)**:
   - macOS runners cost **10× billable minutes**; Windows runners cost **2×**.
   - Spawning 18 concurrent matrix jobs on every commit burns 78 billing minutes per push.
   - **Mandate**: Multi-OS matrices MUST be gated behind manual triggers (`workflow_dispatch`) or tagged release pushes (`v*`), never everyday push triggers.
3. **Paths-Ignore Filtration**:
   - Always filter out non-code paths from CI triggers (`docs/**`, `**.md`, `screenshots/**`, `LICENSE`, `assets/**`).
4. **Offline Asset & Headless Container Hygiene**:
   - Tests in CI run in ephemeral, clean containers without local GUI displays, uncommitted 50MB binary databases, or external internet dependencies.
   - Any test depending on an offline seed database or live hardware MUST declare an explicit skip guard (e.g. `@unittest.skipUnless(PATH.exists(), "Asset missing")`).
   - Never commit tests that require manual asset downloads to pass in CI.
5. **Ban on CI Matrix Lock-in Tests**:
   - Strictly prohibit unit tests that assert exact operating systems or Python matrices in workflow files.

---

## Red Flags & Rationalization Traps

| Red Flag | Reality |
| :--- | :--- |
| *"Should pass now."* | Run the command. Evidence is the only currency. |
| *"Linter passed, so build is fine."* | Linters check style; compilers check structural validity and types. Run the build. |
| *"The unit test passed, so the UI works."* | Unit tests cannot see rendered pixels, CSS overflow, or layout clipping. Run Chrome DevTools session or `ui-shot`. |
| *"The diff looks clean."* | Code syntax can look perfect while failing at runtime. Run verification. |
| *"I'm confident in this change."* | Confidence is an emotion; verification is an empirical observation. Provide the output. |
