---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, modifying behavior, or planning anything new, in software or out of it (a talk, a business, a renovation)."
---

# Brainstorming

You are very good at building. You build what you believe your human
partner wants, and that belief is usually thinner than it feels. This
skill is for finding out what they actually want, and why, before
anything gets built.

People often haven't finished working out what they want. Good questions
help them think it through. When you understand the why, you make the
hundred decisions they never mention the way they would have made them.

## First: What Do You Actually Know?

Before you reply, ask yourself: what do I know about what they want, and
why?

- **Everything that matters is in the request** ("make the icon cornflower
  blue"). This is a quick, clear task. Do it, and say what you did.
- **They are asking for advice, an opinion, or a recommendation** ("Guide me if I should...", "Should this be a web app?", "What architecture do you suggest?"). Give your expert recommendation and key trade-offs first, then ask for their opinion.
- **Something non-trivial is missing from a new feature or project.** Start the conversation.

## Your First Message

Your first message depends on what kind of request they made:

### If they asked for advice, an opinion, or a recommendation:
1. **State your recommendation upfront**: Give a clear, grounded opinion with the core technical trade-offs (pros, cons, feasibility, constraints).
2. **Propose a sensible default direction**: Explain what you would choose and why.
3. **Ask for their opinion/decision**: End with a single, focused question asking for their thoughts, constraints, or preferences regarding your recommendation.

### If they asked to build, redesign, or modify a UI / frontend feature:
1. **Pair with Frontend Design Intelligence**: Invoke `hyperpowers:frontend-design` (and consult `hyperpowers:ui-ux-pro-max`). Ground the proposal in domain aesthetics, semantic color tokens, and mandatory 4-state coverage (empty, loading skeleton, error, interactive).
2. **Present a High-Signal Design Proposal (The WHAT & WHY)**:
   - Visual hierarchy, content grouping, and typography.
   - Interaction mechanics (gestures, sheet sliding, selection markers).
   - *Keep code lines and file edits out of this message* — focus purely on user-facing behavior and visual decisions.
3. **Ask for Approval to Plan**: End with: *"Shall I proceed with writing the implementation plan for this design, or would you like to adjust any details?"*

### If they asked to build a new feature or project from scratch:
1. One line letting them know that if they'd rather skip the questions and
   have you just start, they can say so. If they take you up on it, this
   skill is done: state any significant how-it-gets-made choice
   (platform, language, medium) in one plain line, then do what they
   asked through the normal workflow.
2. One open question that gets them describing. Ask about a real moment
   or a concrete picture: "What's the moment you find yourself wishing
   this existed?" or "Tell me about the people who'll be in the room."

## The Conversation

Each message ends with one question: a single sentence with no list of
example answers hanging off it. Use plain language, pitched just a little
above where your human partner is. Match their vocabulary; never use
process jargon.

Be clear and concise. Lead with what matters. Avoid jargon. When you
report what you found, give them the most important findings and offer
the rest.

**Get them describing vs. Advising.** When exploring an unshaped creative idea, open questions come first because their own words carry intent that options can't. But when asked for guidance, advice, or technical opinions ("what do you think?", "should I do X or Y?", "what architecture do you recommend?"), never deflect with a question. Give your recommendation and reasoning first, then invite their reaction. Offer a short menu of options when they're stuck. When they say "just guess", propose something concrete.

**How it gets made.** Every project rests on choices about medium, tools,
materials, and resources: the platform, programming language, and
libraries for an app; the medium for a piece of art. Find out early which
of those choices they want to make, which they're handing to you, and what
they already have to work with. Someone with strong views or skills will
want to talk it through. Someone counting on you needs sensible defaults,
said in plain words. When there's existing work, build on what it already
uses. Any choice you make goes in the design as your call, never as
something they agreed to.

**Ground to cover.** This is territory, not a script. Never read these
out as questions:

- what kind of thing this is, and what makes it special
- why now, and what success looks like to them
- goals, non-goals, and anti-goals (what would make this a failure even
  if it technically works)
- prior art: what they've seen elsewhere, loved or hated
- current state: what exists now, what they've tried
- the details they care about

**Questions that work** anchor in specifics: "Walk me through the last
time...", "If it could only do one of these well, which?", "What would
make you wince if I got it wrong?" A guess they can correct ("I'm
guessing this is because X keeps biting you?") often beats a question.

**Offer recon.** Once you have a bit of grounding and looking would help, offer to go look: their codebase or project, their own files and data, or the web. If `agent-docs/architecture.md` exists, read it first to understand system topology in seconds without raw searching. Say what you'd look for. They decide whether you go.

**Think wide privately.** Before you propose anything, come up with several ideas and drop the weak ones, including any that fight what they've told you about why. Show the comparison only when it helps them decide.

**Idea Capture & Auto-Reconciliation**:
- *Capture out-of-scope ideas*: When an idea or refactoring suggestion surfaces that is valuable but outside the scope of the immediate feature, log it directly to `agent-docs/ideas.md` (`- [ ] **[Area] Title**: Description`) rather than derailing the active design.
- *Auto-Reconcile*: When reviewing `agent-docs/ideas.md`, check if any active idea has already been implemented or **superseded** by an existing API, native tool, or better architectural alternative. Alert the user and prune it immediately.

**Show, don't tell.** Offer the visual companion (below) whenever seeing
would help more than reading:

- something they'll look at: a screen, a page, a printout, a sign
- a layout or arrangement: of a screen, a room, a schedule
- a flow or a sequence of steps
- options that would look different from each other
- a structure that's easier to see than read: a diagram, a timeline, a map

**Pair with Frontend Design**: If the project involves user interfaces or web frontend components, invoke `hyperpowers:frontend-design` during ideation. Establish domain-anchored aesthetics, ban AI visual clichés, curate semantic color tokens, and plan for all 4 states (empty, loading skeleton, error, interactive) before writing specifications.

Once they've accepted, use it for mockups to react to, side-by-side
options, and throwaway prototypes they can click.

**Spike to feel things out.** Agentic work is waterfall, but very, very
fast. A quick throwaway build is often the cheapest way to learn what
they want or whether something works. Offer one when it would help.
When they just want to spike, get out of the way. Spikes get no tests
or minimal ones, aren't bulletproof, and skip the plan, implementation,
and review process. Bring what the spike taught you back into the
conversation.

## Play It Back

Play back as you go. As soon as you understand one part well enough to
describe it (what it's for and who it serves, say, or how one piece
behaves), describe that part back in about 200-300 words, then return to
questions about the next part. Playback and questions alternate through
the whole conversation; the last chunk covers whatever is left.

Mark anything you're guessing as your guess; only what they said goes in
as theirs. End each chunk by asking what's wrong or missing.

Before you send a chunk, check it: does it describe something they'll
look at, like a page, a screen, a schedule, or a printout? If so, and
they haven't seen the visual companion offer yet, send the offer instead
(its own message, below) and hold the chunk for the next message. Once
they've accepted, put a mockup next to the description.

## Size the Work

Once you understand what they want, pick a size and say it in plain
words. They can override it.

| Size | The full description | Then |
|------|----------------------|------|
| A quick, clear task | the request itself | do it |
| A small change | in chat | build it through the normal workflow |
| A project with a written design | a written design document | a full plan (for software: hyperpowers:writing-plans) |

If it grows mid-task, stop, say so, and step up a size.

If this is really several independent projects, say so, agree on an
order, and brainstorm them one at a time.

## The Written Design

For a project, write a plain document a talented builder in the domain
could plan from without going back to your human partner. Cover:

- intent and the why
- goals, non-goals, anti-goals
- constraints
- the parts of the how they decided, as they decided them
- what's left to the builder

**Where it goes:**
- *Native Artifact Platforms (e.g. Antigravity)*: Save as a native **Design / Spec Artifact** (`write_to_file` in artifact directory with `IsArtifact: true` and `RequestFeedback: true`).
- *Default / Generic Tooling (Claude Code, OpenAI Codex, Cursor, generic CLI)*: Save to project specification file: `docs/specs/YYYY-MM-DD-<topic>-design.md` (or `.specs/<topic>.md`).

**Builder check:** Conduct an inline builder review of the document against the [builder-check-prompt.md](builder-check-prompt.md) rubric in the current turn. Sort what emerges into three piles:

- **Answered already** by the conversation or the project: put the answer in the document.
- **Minor:** a sensible builder could settle it without changing what gets built. Settle it yourself and mark it in the document as your call.
- **Theirs:** only your human partner can answer it, and the answer changes what gets built.

Bring the "theirs" pile in one message, most important first. Update the document with their answers, then link to the design document (or artifact) with a short list of the calls you made so they can check those while reading.

<HARD-GATE>
Nothing gets built until your human partner approves the full
description: in chat for a small change, the document for a project.
Building includes writing product code, scaffolding, installing
dependencies, creating projects, and invoking an implementation skill.
Reading and exploring are fine.

Two exceptions. If they opted out of the questions, the skill is done
and the gate goes with it. A spike they said yes to may be built; it
stays labeled throwaway, and keeping what it produced is a new request
that comes back through this gate.

After a project's document is approved, the next step is the plan. For
software, invoke hyperpowers:writing-plans and no other skill.
</HARD-GATE>

## Red Flags

| Thought | Reality |
|---------|---------|
| "I should ask questions instead of answering when they ask for advice" | Answering a request for advice with a question is deflecting. Give your recommendation and trade-offs first, then ask for their opinion. |
| "I'll offer unprompted options instead of asking them what they want" | For unshaped feature ideas, unprompted options steer. Ask them to describe what they want first. But when asked for advice, do provide options and recommendations. |
| "I'll fill in sensible defaults" | Good. Say them out loud. A default they never heard is one they couldn't reject. |
| "I should explain the process first" | Ask your question. The process shows itself. |
| "They said 'sounds good' to the idea" | Approval covers what you showed them. A description you haven't written isn't approved. |
| "The spike works, I'll keep building on it" | Keeping it is a new request. Back through the gate. |

## Visual Companion

A browser tab for showing mockups, diagrams, and prototypes. It's a
tool, not a mode: accepting it doesn't send every question to the
browser.

**Offer it just-in-time.** Offer it the first time one of the moments
above comes up, never upfront. The offer is its own message with nothing
else in it:

> "This might be easier if I show you. Want me to open a browser tab with some mockups?"

If they decline, stay in text and don't offer again unless they raise it.

**Per question, ask: would they understand this better by seeing it?**
Mockups, layouts, diagrams, and side-by-side designs go in the browser.
Requirements, scope, tradeoffs, and conceptual choices stay in text. A
question about a UI topic isn't automatically a visual question.

If they accept, read `visual-companion.md` in this directory before
starting the server.
