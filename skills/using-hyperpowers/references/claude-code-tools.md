# Claude Code Tool Mapping

Skills speak in abstract actions ("dispatch a subagent", "create a plan", "track tasks", "verify UI", "review code"). On Claude Code, resolve these actions directly to native platform tools:

## Claude Code Tool Mapping Matrix

| Abstract Skill Action | Claude Code Equivalent | Key Usage Invariants |
| :--- | :--- | :--- |
| **Planning & Design** | Native Plan Mode (`EnterPlanMode` / `ExitPlanMode`) or `.claude/plans/` | **Zero chat duplication:** do not dump the full plan text into chat. Use native plan mode or store in `.claude/plans/YYYY-MM-DD-<feature>.md`. |
| **Task Tracking** | `TodoWrite` / `TodoRead` | Populate tasks with status (`pending`, `in_progress`, `completed`). Update state as each task completes. |
| **Subagent Dispatch** | `Agent` tool (`subagent_type: "general-purpose"`) | **Zero-Idle Invariant:** Never dispatch a single subagent for a sequential task and sit idle waiting. Use for independent parallel batches or non-blocking background work. |
| **Code Review** | **Inline Self-Review** against rubric (Default) or `Agent` reviewer | Default to inline self-review of `git diff BASE..HEAD` against rubric in seconds; reserve subagents for parallel multi-module auditing. |
| **File Read** | `View` | Inspect files or line ranges. |
| **File Edit** | `Edit` | Targeted string replacement. |
| **File Create** | `Write` | Write new files. |
| **Shell Commands** | `Bash` | Execute test suites, linters, git commands, and build scripts. |
| **Search & Discovery** | `Grep`, `Glob` | Code and file searches across workspace. |
| **Web Access** | `WebFetch`, `WebSearch` | Public documentation and reference lookups. |
| **Skill Invocation** | `Skill` | Invoke hyperpowers skills dynamically. |

---

## Cheaper Orchestration for Subagent-Driven Development

The controller session is the most expensive seat in a `hyperpowers:subagent-driven-development` run: it reads every dispatch result and report, typically on the session's highest-tier model. Claude Code supports nested subagents (up to `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`), allowing the entire loop to run one layer down.

When your human partner asks for it — or notes that the controller model is too expensive for routine coordination:
1. Dispatch **ONE** orchestrator subagent on a mid-tier model with the plan path and instruction to execute `hyperpowers:subagent-driven-development`.
2. The orchestrator dispatches its own implementers per the skill's Model Selection rules.
3. The orchestrator's final message must include the "Rulings I made" list verbatim to inform the human partner.
4. *Do this only for an entire plan.* Nesting a single task's dispatch adds unnecessary overhead.

---

## Instructions & Configuration

* **Project Instructions**: `CLAUDE.md` in repository root or parent directories.
* **Worktree & Branching**: Use native worktree tools if available; otherwise fall back to git worktrees per `hyperpowers:using-git-worktrees`.
