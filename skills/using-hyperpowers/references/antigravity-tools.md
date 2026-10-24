# Antigravity (`agy`) Native Tool Mapping

Hyperpowers skills declare abstract actions ("dispatch a subagent", "plan tasks", "track progress", "verify UI"). In the Google Antigravity environment, resolve these actions directly to native platform tools:

| Abstract Skill Action | Antigravity Native Equivalent | Key Usage Invariants |
| :--- | :--- | :--- |
| **Planning & Design** | `/plan` slash command or **Plan / Task Artifact** (`write_to_file` in artifact directory). | Write plan directly to an artifact (`ArtifactMetadata.ArtifactType: "task"`). **Zero chat duplication:** never dump the plan text into chat. Never pollute project tree with `docs/hyperpowers/plans/`. |
| **Task Tracking** | **Task Artifact** maintained via `write_to_file` and updated with `replace_file_content`. | Toggle `- [ ]` to `- [x]` as tasks complete. Do **not** use `manage_task` (which is exclusively for background shell processes). |
| **Subagent Dispatch** | `invoke_subagent` tool. | **Zero-Idle Invariant:** Never dispatch a single subagent for a sequential task and wait idle. Dispatch concurrent batches (`Subagents: [...]`) for independent tasks. |
| **Code Review** | **Inline Self-Review** against rubric (Default) or parallel `invoke_subagent`. | Inspect `git diff BASE..HEAD` directly against rubric in current turn in seconds; reserve subagents for parallel multi-module auditing. |
| **Visual Verification** | `ui-shot` CLI (`~/.local/bin/ui-shot`). | Use ephemeral CDP screenshots (Mobile 375px, Tablet 768px, Desktop 1280px+). Never leave persistent browser tabs running. |
| **Interactive Testing** | `browser-mcp` (Lazy tools). | If deep browser interaction is needed, always invoke `browser_close_tab` before ending turn. |

---

## Plan & Task Artifact Invariants

Antigravity provides persistent markdown artifacts for structured state:
1. **Never write plans into user's codebase**: Banned: `docs/hyperpowers/plans/YYYY-MM-DD-feature.md`. Always write to the artifact directory via `write_to_file` (`IsArtifact: true`, `ArtifactMetadata.ArtifactType: "task"`).
2. **Never duplicate plan text into chat**: The artifact renders interactively in the Antigravity UI. Linking to the artifact with a 2-sentence summary and execution options preserves context tokens.
3. **Compaction Recovery**: If the session is compacted, read the task artifact (`- [x]` vs `- [ ]`) and `git log -n 5` to resume immediately from the first pending task.

---

## Execution Models: Hybrid vs Native vs Isolated

When presenting or choosing an execution strategy:

1. **Hybrid Execution (Recommended / Default)**:
   - Sequential, tightly-coupled, or foundational tasks run **natively inline** for rapid iteration and zero spin-up lag.
   - Independent, orthogonal tasks are dispatched **concurrently in parallel** to subagents via `invoke_subagent(Subagents: [...])`.
   - Code review is performed **inline** upon task completion against the reviewer rubric in seconds.
2. **Native Inline Only**:
   - All tasks executed directly by the main coordinator agent in the active session. Fastest for small to medium features with zero subagent overhead.
3. **Full Subagent Isolation**:
   - Fresh subagent per task with independent review gates. Used only when explicitly requested by the user or when total sandbox/context isolation is required.
