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
| **Client UI & Web** | Multi-viewport check via `ui-shot` (Mobile 375px, Tablet 768px, Desktop 1280px+); interactive click/state verification; **zero** console errors/warnings. | "CSS looks right in editor"; unit tests pass while UI is clipped or overflowing. |
| **Configuration & Ops** | Schema validation clean, service health endpoint returns 200, environment variables load with expected defaults. | Config file syntax highlighted cleanly in editor. |

---

## Universal Build & Static Analysis Invariant

Regardless of domain, **every** code change must satisfy static validation before completion:
* **Compilation / Typecheck**: `tsc --noEmit`, `cargo check`, `go build`, `python3 -m py_compile`, etc.
* **Linting / Formatting**: `eslint`, `flake8`, `ruff`, `golangci-lint`, etc.
* **Full Regression Suite**: Broad test suite remains green with zero regressions.

---

## Red Flags & Rationalization Traps

| Red Flag | Reality |
| :--- | :--- |
| *"Should pass now."* | Run the command. Evidence is the only currency. |
| *"Linter passed, so build is fine."* | Linters check style; compilers check structural validity and types. Run the build. |
| *"The unit test passed, so the UI works."* | Unit tests cannot see rendered pixels, CSS overflow, or layout clipping. Run `ui-shot`. |
| *"The diff looks clean."* | Code syntax can look perfect while failing at runtime. Run verification. |
| *"I'm confident in this change."* | Confidence is an emotion; verification is an empirical observation. Provide the output. |
