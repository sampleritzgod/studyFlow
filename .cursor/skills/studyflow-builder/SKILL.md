---
name: studyflow-builder
description: Drives StudyFlow's build end-to-end across its full roadmap (Phase 0 through Phase 8) — a personal student productivity/learning platform on Next.js 15, Clerk, Neon Postgres, Prisma 7, and Vercel. Use this whenever working on StudyFlow specifically — to figure out the current phase and next task, generate the next concrete build step, check a phase's definition of done, or when the user says things like "what's next," "continue building," "start phase N," or mentions StudyFlow, its PROJECT.md, or its CLAUDE.md. Always use alongside phased-project-execution (general build discipline) and nextjs-deployment-troubleshooting (known error fixes for this exact stack) — this skill has the project-specific facts, those two have the general reasoning.
---

# StudyFlow Builder

StudyFlow is a personal productivity and learning platform, built by a solo college student (for themselves first) to fix four concrete problems: an unstructured mind (scattered notes), inconsistent focus, a thin network, and unclear career direction — architected from day one so it could grow into a real SaaS, but built and shipped one finished phase at a time.

This skill holds what's specific to StudyFlow — the locked-in stack and the exact phase breakdown.

## Companion skills (always load with this one)

| Need | Skill | Path |
|------|--------|------|
| *How* to phase, verify, and resist scope creep | **phased-project-execution** | [../phased-project-execution/SKILL.md](../phased-project-execution/SKILL.md) |
| *Why* a Prisma / Neon / Vercel / Clerk build-or-deploy step failed | **nextjs-deployment-troubleshooting** | personal Codex/Cursor skill (known-signatures table) |

`PROJECT.md` is live status. This skill + `references/roadmap.md` are the plan. `phased-project-execution` is the discipline — never mark a StudyFlow phase done without real command/HTTP evidence from that skill's rules.

## Locked-in stack

Don't re-litigate these without an explicit request to change them — each was arrived at after hitting a real, specific problem with the alternative:

| Concern | Choice | Superseded |
|---|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript, npm, Tailwind v4 | — |
| Auth | Clerk | Cognito + Auth.js — dropped after repeated region/Hosted-UI/secrets friction |
| Database | Neon (managed Postgres), Prisma 7 via `@prisma/adapter-pg`, connection config in `prisma.config.ts` (not `schema.prisma` — Prisma 7 removed `url`/`directUrl` from there) | Aurora Serverless v2 — dropped for cost, VPC complexity, and being a first AWS project |
| Package manager | npm | pnpm — dropped after repeated, only-partially-fixable Vercel lockfile-parsing failures |
| Hosting | Vercel | AWS Amplify — dropped after an unresolved SSM secrets-injection failure kept breaking auth regardless of how many times the actual config was fixed |

If asked to reconsider any of these, that's a legitimate request — just flag that it's a re-litigation of a settled decision with a specific reason behind it, not a neutral choice, so the reason is on the table too.

## How to use this skill each session

1. **Read `PROJECT.md`** (ask for its content if it isn't directly accessible) to find which phase is marked in progress and what's already checked off. This file is the actual source of truth for status — this skill's roadmap is the plan, not a live tracker.
2. **Identify the single next unfinished task** within that phase only — see `references/roadmap.md` for the full phase-by-phase task breakdown and each phase's definition of done.
3. **Check scope before proposing work.** If the request reaches past the current phase, say so explicitly rather than quietly doing it — this is `phased-project-execution`'s core discipline, applied here.
4. **Produce the next concrete step.** Either do it directly, or — matching this project's established workflow — generate a precise, copy-pasteable prompt for Claude Code to execute, then ask for real verification output (an actual log, an actual HTTP response) before treating it as done.
5. **If a build or deploy error shows up**, check `nextjs-deployment-troubleshooting`'s known-signatures table before diagnosing from scratch — several of these have already been hit and root-caused once.
6. **Once a phase's definition of done is genuinely verified** (real output, not a description of output), update `PROJECT.md`'s changelog with one line and move the in-progress marker to the next phase.

## Reference

See `references/roadmap.md` for the complete Phase 0–8 breakdown: scope, concrete tasks, and definition of done for each phase.
