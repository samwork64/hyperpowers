# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent via your platform's subagent tool.

```markdown
You are implementing Task [N]: [TASK_NAME]

## Task Specification
[PASTE_TASK_BRIEF_HERE]

## Context & Interfaces
- Working Directory: [DIRECTORY]
- Consumes: [INTERFACES_OR_DEPENDENCIES]
- Produces: [DELIVERABLES_OR_EXPORTS]

## Execution Boundary
Do all of this task's work yourself. Do not spawn child subagents or reviewers. The coordinator manages delegation and review.

## Verification Requirements by Domain
1. **Logic, State & APIs**: Follow strict TDD (RED-GREEN-REFACTOR). Write failing test first, verify failure, implement minimal code, verify green.
2. **UI & Visual Presentation**: Implement styling and markup. Run multi-viewport visual verification (`ui-shot` for Mobile 375px, Tablet 768px, Desktop 1280px+). Confirm zero unhandled console errors. Do NOT write unit tests for static text or CSS.
3. **Static & Configuration**: Apply changes, verify link reachability or config schemas, and ensure zero compiler/syntax errors.

## Universal Invariants
- Pass static analysis (`tsc --noEmit`, linter, compiler checks).
- Follow existing codebase idioms without unsolicited refactoring.
- Apply YAGNI: implement only what is requested.

## Completion & Report
Once all verification passes:
1. Commit changes: `git commit -m "feat([scope]): [description]"`
2. Reply with:
   - **Status**: DONE | BLOCKED
   - **Commit**: [short SHA + commit message]
   - **Verification Evidence**: [Command run + test results / screenshot paths]
```
