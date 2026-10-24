# Hyperpowers Unified Code Review Rubric

Use this authoritative rubric when reviewing code changes (`hyperpowers:requesting-code-review`) or when deliberating on review feedback (`hyperpowers:receiving-code-review`). Every finding must cite `file:line` and state the concrete failure mode.

---

## The 6 Evaluation Axes

### 1. Spec & Contract Compliance
- **Requirement Fidelity**: Does the change implement exactly what was specified in the approved plan or task brief?
- **Anti-Scope Creep (YAGNI)**: Are there speculative helpers, unused configuration flags, unrequested endpoints, or dead code? If so, remove them.
- **Backward Compatibility & Contract Stability**: Does modifying an existing function signature, API schema, or CLI argument break existing call sites?

### 2. Architectural Integrity & Modularity
- **Cohesion & Coupling**: Does the change belong in this subsystem? Does it respect the architectural boundaries established in `agent-docs/architecture.md` and `agent-docs/modules/<subsystem>.md`?
- **Design System Token Architecture**: In frontend code, are semantic tokens (`bg-background`, `text-foreground`, `border-border`, `bg-primary`, `bg-destructive`) used instead of hardcoded hex values or arbitrary utility colors?
- **No Parallel Clones**: Does this reinvent logic or utility helpers that already exist elsewhere in the repository?

### 3. Failure Modes & Boundary Edge Cases
- **Boundary Values**: Are empty arrays, zero length, negative offsets, and maximum limits handled gracefully?
- **Null, Undefined & Missing Keys**: Are optional values and missing schema fields safely guarded?
- **Error Propagation & Envelopes**: Are errors captured with informative diagnostics and propagated without leaking internal stack traces to end users?
- **Resource Lifecycle**: Are database connections, open files, sockets, child processes, and ephemeral listeners reliably closed/freed via `try...finally`, context managers, or traps?

### 4. Security, Sanitization & Secret Hygiene
- **Zero Secrets**: Are API keys, credentials, tokens, or private endpoints committed? (Use environment variables).
- **Input Sanitization**: Are database queries parameterized (preventing SQL injection)? Are shell arguments escaped? Is user-provided HTML sanitized (preventing XSS)?
- **Network Boundaries**: Are CORS origins, request body size limits, and rate limits configured appropriately?

### 5. Test Authenticity vs. Test Theater
- **Rejection of Test Theater**: Reject tests that merely assert static text exists, tautologically mock everything being tested, or test declarative CSS classes.
- **Genuine Failure Mode Testing**: Does the test verify real state transitions, parameter encoding, boundary limits, or schema validation?
- **Condition-Based Waiting**: In async tests, are arbitrary timeouts (`sleep(1000)`) strictly avoided in favor of condition-based polling (`waitFor`, event triggers)?
- **Hermetic Isolation**: Does the test run reliably in any order without polluting subsequent tests?

### 6. Performance & Resource Hygiene
- **Algorithmic Complexity**: Are there $O(N^2)$ loops or unindexed array lookups on hot execution paths?
- **Database & I/O Hygiene**: Are there N+1 query patterns or redundant file reads inside loops?
- **Memory & Process Leaks**: Are background timers, un-reaped child processes, or growing global maps prevented?

---

## Severity Classification & Adjudication

| Severity Level | Definition | Action Required |
| :--- | :--- | :--- |
| **Critical (Must Fix)** | Logic bugs, data corruption/loss, security vulnerabilities, broken public contracts, build/test failures. | **Blocks merge**. Must be fixed immediately with regression verification. |
| **Important (Should Fix)** | Missing boundary edge cases, architectural coupling, resource leaks, poor error handling, test theater. | Must be resolved before branch finalization. |
| **Minor (Polish / Optional)** | Variable naming clarity, local comment improvements, non-critical style consistency. | Address if quick; discard if speculative or YAGNI. |
