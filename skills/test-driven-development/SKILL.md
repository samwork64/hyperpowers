---
name: test-driven-development
description: Use when implementing logic, contracts, state, or algorithms where test-driven verification provides real value. Reject test theater.
---

# Test-Driven Development (TDD) & Verification Judgment

## Overview

Test-Driven Development is an engineering discipline for designing and verifying **behavior, contracts, dynamic logic, and state transitions**. 

Write the test first. Watch it fail. Write minimal code to pass.

**Core Principle**: A test is only valuable if it verifies real behavior and guards against actual failure modes. If a test does not test dynamic behavior or contracts, writing it is **test theater**.

---

## 1. The Judgment-First Framework: Assessing the Failure Mode

Before writing code or tests, evaluate the change against three fundamental questions:

### Question 1: What is the real failure mode here?
* **Algorithmic / Behavioral**: The code computes values, formats data, transforms schemas, manages state, or implements branching logic (e.g., a URL generator building query strings from dynamic parameters).
  $\rightarrow$ **Right Tool**: **Unit / Integration Test (TDD)**. Test input variations, edge cases (empty strings, special characters), and contract validity.
* **Visual / Layout / Responsive**: The change is about CSS, spacing, alignment, typography, colors, or mobile breakpoints.
  $\rightarrow$ **Right Tool**: **Visual & Multi-Viewport Verification (`ui-shot`)**. Unit tests cannot see clipped text, overflowing boxes, or broken layouts. Inspect real viewports at 375px, 768px, and 1440px.
* **Endpoint / Link Integrity**: A link or URL was updated or added.
  $\rightarrow$ **Right Tool**: **HTTP / Live Verification**. Testing whether `href === "url"` is tautological theater; testing that the URL actually responds with HTTP 200 or returns expected schema data is what matters.
* **Syntax / Imports / Types**: The change is a typo fix, configuration update, or minor copy tweak.
  $\rightarrow$ **Right Tool**: **Compiler, Type-Checker & Linter** (`tsc --noEmit`, `eslint`, `python -m py_compile`). Unit tests are completely redundant here.

### Question 2: Does a unit test provide real engineering value or is it test theater?
* **Test Theater**: A test that simply repeats the source code in a second file without exercising logic (e.g., asserting that a static string constant equals that string, or that a button has label "Submit"). **Reject test theater.**
* **Real Engineering Value**: A test that proves a contract, tests branching logic, protects against regression during refactoring, or catches boundary edge cases.

### Question 3: What is the most effective verification combination?
Choose the verification strategy that matches the risk. For example:
* *Dynamic URL Generator*: Unit tests for parameter encoding + live check that the target endpoint accepts the query.
* *Interactive UI Component*: Logic test for state/event dispatch + visual `ui-shot` check for layout.
* *Static Content / Documentation Link*: Syntax/compile check + HTTP link check.

---

## 2. 3-Tier Test Architecture & CI Partitioning

To guarantee sub-15-second local inner loops and eliminate catastrophic CI quota burn (>95% cost reduction), all tests must be partitioned into three disciplined tiers:

| Tier | Characteristics & Scope | Execution Boundary | CI Runner Policy |
| :--- | :--- | :--- | :--- |
| **Tier 1: Fast Unit & Logic** | In-memory, zero network, zero heavy file I/O, $<10$ms per test. Tests pure transformations, reducers, schema parsers, and algorithmic branches. | **Inner Loop**: Target single active test file.<br>**Outer Loop**: Entire Tier 1 suite executes in $<15$s. | **Standard Push CI**: Runs on every push/PR via a single fast `ubuntu-latest` runner. |
| **Tier 2: Tagged Heavy / Integration** | Live sockets, subprocesses, database seeds, slow migrations, or multi-OS binaries. Must be tagged (e.g. `@pytest.mark.integration`, `--exclude integration`). | **Explicit Local Invocation**: Run manually when touching integration boundaries. | **On-Demand Only**: Excluded from default push CI. Run via `workflow_dispatch` or release tags. Must include `@unittest.skipUnless(ASSET_PATH.exists())` guards so missing uncommitted binaries skip cleanly. |
| **Tier 3: Visual & Ephemeral Verification** | Multi-viewport rendering, typography, responsive layout, CSS variables. | **Chrome DevTools / `ui-shot`**: Captured across 375px, 768px, 1280px in $\sim 1$s. | **Never in Unit Tests**: Asserting HTML/CSS strings in unit tests is **strictly banned test theater**. |

---

## 3. Test Lifecycle & Obsolescence Pruning (Anti-Bloat Mandate)

Tests are not sacred artifacts to be accumulated indefinitely; they have a finite lifecycle:

1. **Delete Obsolete & Transitional Tests Immediately**:
   - When a feature, API signature, or UI flow is redesigned or retired, **actively delete its obsolete unit tests**. Do not leave dead tests to rot or cause false regression alarms.
   - Tests created as temporary debug probes or spikes during an investigation MUST be deleted before completing the task.
2. **Strict Ban on "Change-Detector String Scrapers"**:
   - **Banned**: Opening `.html`, `.css`, `.yml`, `.json`, or `.md` files to assert substrings or regexes (e.g. `assertIn("btn-cta", html)` or `assertIn("macos-latest", ci_yaml)`).
   - These are change detectors that break on legitimate refactors while catching zero logic bugs. Delete them on sight.
3. **No CI Matrix Lock-in Tests**:
   - Never write tests asserting the exact list of runners, Python versions, or platforms in CI workflow files.

---

## 4. Anti-Flakiness & Hermetic Isolation Invariants

Flaky tests erode confidence and waste tokens. Enforce two strict rules:

### A. Zero Arbitrary Timeouts (Condition-Based Waiting Only)
- **Banned**: Fixed `sleep(1000)` or `setTimeout` delays in tests.
- **Enforced**: Condition-based polling (`waitFor`, polling loop with micro-sleeps and hard timeout threshold, or event promises). Tests run as fast as the machine allows and fail with clear diagnostics on real timeouts.

### B. Hermetic Test Isolation (No Shared Mutable State)
- Tests must be executable in any random order without cascading failures.
- Always use ephemeral fixtures: isolated database transactions with auto-rollback, unique temporary directories (`tmp_path`), and ephemeral ports (`:0`).
- Reset mock singletons and global environment variables in `afterEach` / `teardown`.

---

## 5. Full-Stack Schema & Contract Synchronization

When implementing client-server features:
1. **Schema-First Contracts**: Define input/output schemas (Zod, Pydantic, OpenAPI) once. Test boundary parsing:
   - Valid inputs parse to strongly-typed objects.
   - Missing required fields throw expected validation errors.
   - Unexpected fields are stripped or rejected.
2. **Standardized Error Envelopes**:
   - Ensure backend error responses follow a uniform structure: `{ error: { code: string, message: string, details?: unknown } }`.
   - Test that client fetchers correctly catch and handle these envelopes rather than crashing with unhandled JSON parse exceptions.

---

## 6. The Red-Green-Refactor Cycle

When a test is warranted, follow the strict cycle:

```mermaid
flowchart LR
    red["RED: Write Failing Test"] --> verify_red{"Fails Correctly?"}
    verify_red -- "Wrong Failure" --> red
    verify_red -- "Expected Failure" --> green["GREEN: Minimal Code"]
    green --> verify_green{"Passes Cleanly?"}
    verify_green -- "No" --> green
    verify_green -- "Yes" --> refactor["REFACTOR: Clean Up"]
    refactor --> verify_refactor{"Still Passing?"}
    verify_refactor -- "Broken" --> refactor
    verify_refactor -- "All Green" --> next["Next Test"]
    next --> red
```

### RED: Write One Minimal Failing Test
Demonstrate the contract: what inputs go in, what output comes out, or how an edge case behaves.

```typescript
// Example: Testing dynamic URL query generation
test('generates valid catalog search URL with encoded parameters', () => {
  const url = buildCatalogUrl({ system: 'snes', search: 'super mario & friends', page: 2 });
  expect(url).toBe('/api/catalog?system=snes&search=super%20mario%20%26%20friends&page=2');
});

test('omits undefined or empty search parameters from catalog URL', () => {
  const url = buildCatalogUrl({ system: 'snes', search: '' });
  expect(url).toBe('/api/catalog?system=snes');
});
```

### Verify RED: Confirm It Fails For the Right Reason
Run the **targeted test runner** on the specific test file or case (e.g. `pytest tests/test_billing.py -k test_checkout` or `npm test -- tests/billing.test.ts`). Confirm it fails because the feature or logic is missing, not because of an import error or typo.
> **Time & Token Invariant**: Never run the full multi-module test suite on every inner TDD step. Target only the active test file; reserve the full suite for the outer completion gate.

### GREEN: Implement the Minimal Code
Write just enough code to satisfy the test contract. Do not add speculative features or premature abstractions.

### Verify GREEN: Confirm Test Passes
Re-run the targeted test runner and verify it passes cleanly.

> [!IMPORTANT]
> **The 2-Failure Escalation Circuit Breaker**: If two consecutive attempts to make the test turn GREEN fail (or induce secondary regressions), you are strictly prohibited from guessing or trying a third edit. Halt immediately and escalate to `hyperpowers:systematic-debugging` to trace causal signal flow, inspect root causes, and formulate a falsifiable hypothesis.

### REFACTOR: Clean Up
Remove duplication, improve variable names, or optimize performance while keeping the test suite green.

---

## 7. The Universal Invariant: The Build & Syntax Gate

Regardless of whether a task is verified via TDD, visual verification, or link checks:

**EVERY code change must pass static analysis and compilation before being declared complete:**
* Type checks: `npx tsc --noEmit` or language equivalent.
* Syntax / Lint checks: `npm run lint`, `eslint`, or `python3 -m py_compile`.
* Full Suite Regressions: Ensure the broader test suite remains green.

---

## 8. Deep-Dive References

- [writing-good-tests.md](references/writing-good-tests.md) — Comprehensive principles for naming breaks, literal fixtures, and eliminating test theater.
