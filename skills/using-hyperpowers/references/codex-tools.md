# OpenAI Codex Tool Mapping

Skills speak in abstract actions ("dispatch a subagent", "create a plan", "track tasks", "verify UI", "review code"). On OpenAI Codex, resolve these actions directly to platform tools:

## Codex Tool Mapping Matrix

| Abstract Skill Action | OpenAI Codex Equivalent | Key Usage Invariants |
| :--- | :--- | :--- |
| **Planning & Design** | Markdown Plan file: `docs/plans/YYYY-MM-DD-<feature>.md` | **Zero chat duplication:** do not dump the full plan text into chat. Write to file and summarize key architectural decisions. |
| **Task Tracking** | Markdown checklist (`- [ ]` $\rightarrow$ `- [x]`) in plan or project `TODO.md` | Update checklist via editor tools as tasks pass verification. |
| **Subagent Dispatch** | `spawn_agent` with multi-agent V2 | **Zero-Idle Invariant:** Never dispatch a single subagent for a sequential task and wait idle. Dispatch concurrent batches for independent tasks. |
| **Subagent Fixes** | `followup_task` | Resume existing child with fix requests. Transparently reloads evicted children. |
| **Event Waiting** | `wait_agent` (`timeout_ms: 300000-600000`) | Event subscription, not a poll. Do not wait if local work remains. |
| **Code Review** | **Inline Self-Review** against rubric (Default) or `spawn_agent` reviewer | Default to inline self-review of `git diff BASE..HEAD` against rubric in seconds. |
| **File Read** | Native file reading tool or shell `cat` | Inspect code and test files. |
| **File Edit** | Native file patch/edit tool | Targeted code modifications. |
| **Shell Commands** | Native terminal / bash tool | Execute test suites, compilers, and linters. |

---

## Subagent Dispatch Requires Multi-Agent Support

Add to your Codex config (`~/.codex/config.toml`):

```toml
[features]
multi_agent = true
```

This enables the multi-agent tools that skills like `dispatching-parallel-agents` and `subagent-driven-development` use:

- **Spawning:** Give children a clean context with `spawn_agent {fork_turns: "none"}`; the default `"all"` copies your entire transcript into the child. On Codex 0.145+, role files under `~/.codex/agents/` attach to isolated forks via `agent_type`.
- **Fix rounds:** Resume the implementer with `followup_task` — it delivers your message, triggers a turn, and transparently reloads a child the harness evicted. Never dispatch a fresh implementer on the theory that a spawned agent cannot be messaged again; on V2 it always can.
- **Lifecycle:** V2 has no `close_agent`. Finished children are evicted automatically when slots are needed; leaving them unclosed costs nothing. Only V1 sessions have `close_agent` — there, close reviewers when their review returns, and close each implementer after its task's review passes.
- **Model names:** Never copy a model name from a skill or table without checking it against your current spawn allowlist.

---

## Waiting on Children

`wait_agent` is an event subscription, not a poll: a long wait wakes the moment a child produces mailbox activity, with the same latency as a short one.
- While you still have local work, do not wait at all. A completed child's final answer is pushed into your mailbox and arrives with your next turn.
- When genuinely idle with children outstanding, wait in bounded stretches: `wait_agent` with `timeout_ms` 300000-600000 (5-10 minutes). After each stretch, post one status line, run `list_agents`, and chase any child that finished without reporting.

---

## Model Routing on Spawns

Every `spawn_agent` you issue sets `model` AND `reasoning_effort` explicitly, per the Model Selection rules of the skill you are executing. Setting `model` alone is a trap: the child's effort silently resets to that model's default, not to yours.

Add a machine-level backstop to `~/.codex/config.toml`:

```toml
[agents]
default_subagent_model = "<a mid-tier model from your spawn allowlist>"
default_subagent_reasoning_effort = "medium"
```

---

## Environment Detection

Skills that create worktrees or finish branches should detect their environment with read-only git commands before proceeding:

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

- `GIT_DIR != GIT_COMMON` → already in a linked worktree (skip creation)
- `BRANCH` empty → detached HEAD (cannot branch/push/PR from sandbox)

---

## Codex App Finishing

When the sandbox blocks branch/push operations (detached HEAD in an externally managed worktree), the agent commits all work and informs the user to use the App's native controls:

- **"Create branch"** — names the branch, then commit/push/PR via App UI
- **"Hand off to local"** — transfers work to the user's local checkout
