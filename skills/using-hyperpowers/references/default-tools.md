# Universal / Default Tool Mapping (Fallback Reference)

Hyperpowers skills declare abstract actions ("dispatch a subagent", "create a plan", "track tasks", "verify UI", "review code"). When running in an environment without specialized proprietary tools (e.g. Cursor, Windsurf, GitHub Copilot CLI, Devin, OpenCode, Aider, or generic terminal LLM harnesses), resolve these actions using standard file, shell, and editor primitives:

## Universal Tool Mapping Matrix

| Abstract Skill Action | Default / Generic Tool Equivalent | Operational Behavior |
| :--- | :--- | :--- |
| **Plan Storage** | Markdown file: `docs/plans/YYYY-MM-DD-<feature>.md` or `.plans/<feature>.md` | Write plan directly to disk. **Zero chat duplication:** never dump the entire plan into chat; summarize key decisions and provide the file link. |
| **Design / Spec Storage** | Markdown file: `docs/specs/YYYY-MM-DD-<topic>-design.md` or `.specs/<topic>.md` | Store design specification in project docs before planning. |
| **Task Tracking** | Markdown checklist (`- [ ]` $\rightarrow$ `- [x]`) in the plan file or project `TODO.md` | Update the checklist using standard file edit tools as each task passes verification. Bundled helper scripts (`task-start`, `task-done`) may also be used. |
| **Subagent Dispatch** | Platform agent tool if installed; **otherwise execute sequentially inline** | **The Zero-Idle Invariant:** If no subagent tool is available, do **not** invent nonexistent tools. Execute tasks sequentially inline in the active session. If subagents exist, dispatch only for independent parallel batches. |
| **Code Review** | **Inline Self-Review** against rubric in current turn | Coordinator inspects `git diff BASE..HEAD` directly against the [code-reviewer.md](../../requesting-code-review/code-reviewer.md) rubric in seconds. |
| **File Read** | Native file reading tool (`view_file`, `read_file`) or `cat` / `head` | Inspect full file or line ranges. |
| **File Edit / Patch** | Native edit tool (`replace_file_content`, `edit_file`, `patch`) | Make targeted, surgical replacements. |
| **Shell Commands** | Native shell tool (`run_command`, `bash`, `terminal`) | Run test runners (`pytest`, `npm test`, `cargo test`), linters, and git commands. |
| **Visual UI Verification** | Chrome DevTools / CDP session script or `ui-shot` CLI (`~/.local/bin/ui-shot`) | Maintain 1 session for interactive UI flows; capture multi-viewport layouts (375px, 768px, 1280px+). Explicitly close browser sessions before ending turn. |

---

## 1. File-Based Plan & Spec Conventions

When native UI artifacts (such as Antigravity artifacts or Claude Code plan modes) are unavailable:
1. **Standard Location**:
   - Plans: `docs/plans/YYYY-MM-DD-<feature-name>.md` (or `.plans/` if hidden directory is preferred by project).
   - Specs: `docs/specs/YYYY-MM-DD-<feature-name>-design.md`.
2. **Context Safety**:
   - Avoid creating un-tracked files in arbitrary folders. Ensure `docs/` or `.plans/` is committed or appropriately handled in `.gitignore`.
3. **Session Compaction Recovery**:
   - When a session compacts or resumes, read the plan file on disk, check the latest git commits (`git log -n 5`), and resume at the first unchecked `- [ ]` task.

---

## 2. Universal Subagent Fallback Strategy

Not all environments have native subagent dispatch:
* **If Subagents Are Supported**:
  - Dispatch only for **parallel independent batches** ($\ge 2$ decoupled tasks).
  - Never dispatch a single subagent for a sequential task and sit idle waiting.
* **If Subagents Are NOT Supported**:
  - Do **not** fail or halt.
  - Automatically adopt **Native Inline Execution**: execute all tasks sequentially in the active session.
  - Inline execution is often faster and uses fewer tokens because it avoids subagent bootstrap latency and context duplication.

---

## 3. High-Speed Review Protocol

Without multi-agent review infrastructure:
1. Gather the diff: `git diff HEAD~1..HEAD` or `git diff BASE..HEAD`.
2. Self-evaluate against the domain rubric (Logic & APIs, Systems & Native, CLI & Tools, UI & Presentation).
3. Fix any Critical or Important issues immediately before proceeding to the next task.
