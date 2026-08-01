---
name: phased-project-execution
description: Use when helping someone plan or build an ambitious multi-feature project (an app, product, or system) — especially a solo or small-team build with a big, exciting scope. Breaks large ambitions into sequenced, independently-finishable phases with a concrete definition of done for each, insists on real verification (actual command output, live test results) before marking anything complete, and actively resists scope creep and premature complexity. Trigger this whenever someone describes a big idea and wants to "build" it, asks for a roadmap or phase plan, says things like "let's do all of it," or when a project has stalled or sprawled and needs re-scoping into something actually finishable. Also trigger mid-build whenever someone reports a step as "done" without pasting real output — verification discipline is part of this skill, not a one-time setup step.
---

# Phased Project Execution

A methodology for turning an ambitious project idea into something that actually ships, instead of sprawling into an unfinished pile. Built from watching this pattern work end-to-end on a real solo project — a student productivity app with four major feature pillars, taken from idea to a live, working deployment.

## Companion (StudyFlow repo)

When working in **StudyFlow**, also load [studyflow-builder](../studyflow-builder/SKILL.md) for the locked stack, phase task list, and definitions of done. This skill is the general methodology; that one has the project-specific facts. Status lives in `PROJECT.md`, not in either skill.

## Core discipline

1. **Ambition is fine. Simultaneity is the enemy.** When someone describes a project with several big feature areas ("all 4" of them), the right response isn't to pick one and quietly drop the rest — it's to sequence all of them into an order where each is real and finished before the next opens. Name the full ambition explicitly as the eventual roadmap so nothing gets lost, then insist on an order.

2. **Every phase needs a concrete "done when."** Not "the code compiles" — a definition tied to actual use: "you've used it for your own notes for a week," "you've logged real study sessions with it," a live URL returning real data from a real database. Vague completion criteria ("basically working") are how projects quietly stall.

3. **Verify before advancing — every time, even the tenth time.** "Done," "yea done it," or an agent's summary of what it *attempted* are not evidence. Ask for the actual output: command results, a live HTTP response, a real log, start to finish. This isn't distrust of the person — intermediate tools (build systems, deploy platforms, coding agents) fail silently far more often than they fail loudly, and catching that at the "done?" checkpoint is far cheaper than catching it three phases later when something else has been built on top of the silent failure.

4. **No over-engineering — cut, don't gold-plate.** Concretely:
   - Don't build infrastructure for a feature that isn't in the current phase (e.g. don't design a full data model for something scheduled three phases out).
   - Don't add a tool, library, or service "just in case" — every addition should trace to a need in the *current* phase.
   - When a feature has a structural blocker that better engineering can't solve (e.g. a peer-matching feature that needs other real users, and there are none yet), don't schedule it earlier than the blocker resolves. Rescope it to what's usable without the blocker, or push it to the point where the blocker is actually gone — and say so explicitly rather than quietly working around it.
   - Prefer boring, well-supported choices over the newest option, especially for infrastructure — the newest major version of a tool is where undocumented compatibility gaps live.

5. **Get the skeleton deployed early, not last.** Get the smallest possible end-to-end path (empty app, real database connection, real auth, live on real hosting) working before building features on top of it. This turns deployment from a scary unknown saved for the end into something already solved — every feature phase after that just extends something already live, instead of every risk surfacing at once at the very end.

6. **Ask before big pivots, not after.** Database choice, hosting provider, auth provider, region, "does this replace or extend the existing plan" — these are cheap to get right when asked up front and expensive to redo later. When a decision is genuinely ambiguous and consequential, ask one concrete question with real options rather than guessing and finding out later.

7. **Audit before rewriting.** Before a large or irreversible change (swapping an entire auth provider, deleting infrastructure, migrating a database), first enumerate exactly what's touched — every file, every dependency — and confirm the blast radius before executing. This catches scope surprises before they happen instead of after.

## Setting it up

For any project going through this process, maintain two lightweight files instead of relying on conversation memory:

- **A working-rules file** (e.g. `CLAUDE.md`) — the non-negotiable principles (points 1–7 above, adapted to the project), the current stack, and the phase list. Read at the start of every session; work only within the current phase's scope unless told otherwise.
- **A living status doc** (e.g. `PROJECT.md`) — what's actually done, what's in progress, one changelog line per completed phase. This is the source of truth for "where are we," not memory of the conversation.

## Building the phase list itself

When someone brings a multi-part idea:

1. Identify the genuinely separable pieces — features or pillars that could each stand alone as useful on their own.
2. For each, ask: does it depend on something that doesn't exist yet (other users, prior data, a later phase's output)? If so, it can't go early — order follows real dependency, not preference.
3. Sequence: foundation → deploy skeleton → the most self-contained, no-dependency features first → features needing infrastructure (payments, notifications, monitoring) → features needing scale or other real users last.
4. Write one line of "done when" per phase before writing any code for it.
5. Confirm the sequence with the person before starting. They may weight priority differently than dependency order suggests — that's a legitimate reason to reorder, just not to parallelize everything.

## Red flags to watch for, and what to do

| Signal | What it usually means | Response |
|---|---|---|
| "Let's just build all of it" | Genuine ambition, not yet a plan | Capture all of it as the roadmap; still insist on one open phase at a time |
| "Done" / "yea" with no output pasted | The step may not have actually been verified | Ask for the specific real output before treating it as closed |
| A feature idea needing other users/data that don't exist yet | Structural blocker, not a build-order problem | Rescope to what's usable solo now; schedule the full version for after the blocker resolves |
| Wanting to add a tool or service "just in case" | Premature complexity | Ask what current-phase need it serves; if none, defer it |
| A large rewrite requested in one step ("swap the whole auth system") | Real but risky | Audit the full blast radius first, get it confirmed, then execute |
| A build/deploy step reported fixed, but the same error resurfaces | The fix may not have addressed the actual root cause | Pull the real artifact directly if possible (repo file, full log) instead of iterating on descriptions of it |

## When to deviate

This is a default, not a law. If someone explicitly wants to move fast and accepts the risk of skipping verification, or is prototyping something disposable, relax the discipline — but say so out loud rather than relaxing it silently.
