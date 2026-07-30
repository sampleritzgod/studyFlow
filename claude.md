# StudyFlow — working rules

## What this is
A personal productivity + learning platform, built by a solo college student
(me) to fix my own unstructured notes, inconsistent focus, thin network, and
unclear career direction — designed from day one so it could become a real
SaaS others use later, but built and shipped one working piece at a time.

## Non-negotiable principles
1. **No over-engineering.** The simplest solution that's still production-safe
   wins. No abstraction for hypothetical future needs. No new library "just in
   case" — if it's not in the stack list below, ask before adding it.
2. **One phase, one task, at a time.** See roadmap below. Never write code for
   a later phase while the current one isn't done. If I ask for something
   outside the current phase, point that out before doing it.
3. **Ask when unclear.** A wrong assumption costs more than a clarifying
   question. Ask before any change that affects architecture, cost, data
   model, or UX direction — don't silently pick for me.
4. **Stable over trendy.** Use current-stable versions of what's already in
   the stack. Don't swap tools or add new ones without asking first.
5. **Every phase ends with something clickable.** Not "the code compiles" —
   an actual working screen I can use, against the real database, not mocks.

## UI/UX bar — non-negotiable
- Minimal, modern, uncluttered. Generous whitespace, clear hierarchy. Follow
  general design principles — never copy a specific brand or product's layout.
- One consistent design system: fixed type scale, fixed spacing scale, a
  small fixed color palette via Tailwind config / CSS variables. No ad hoc
  pixel values or one-off colors on a single screen.
- Every screen needs all three states designed, not just the happy path:
  **loading**, **empty**, and **error** — none of these is an afterthought.
- Mobile-first. Check every feature at 375px width before calling it done.
- Accessibility basics always: color contrast, keyboard navigation, semantic
  HTML, alt text. Not optional, not "later."
- Prefer a small set of well-built reusable components (button, card, input,
  modal) over one-off styled elements per page.
- Perceived speed matters — skeleton states over blank spinners where it's
  reasonable to build one.

## Stack — do not change without asking
- Next.js 15 (App Router) + React 19 + TypeScript, pnpm, Tailwind v4
- Auth: Cognito + Auth.js (next-auth v5), JWT sessions
- DB: Neon (managed Postgres), Prisma 7 with @prisma/adapter-pg
- Deploy target: AWS Amplify Hosting

## Roadmap — current phase governs scope
0. Foundation (auth done; finish Neon + Prisma wiring)
1. Deploy skeleton — bare app live on Amplify + real Neon DB, before any features
2. Notes/PKM — CRUD, bidirectional links, graph view
3. Deep work tracker — Pomodoro, time-blocking, focus scorecard
4. Monetization scaffolding — Stripe, pricing, plan gating
5. Career portfolio — milestones, checklists
6. Personal outreach CRM — relationship tracker + AI-drafted emails
   (not peer-matching yet — that needs real users)
7. Production hardening — Secrets Manager, CloudWatch, SES, rate limiting,
   backups, privacy policy/ToS, CI with tests
8. Peer-matching — only once there's a real user base to match against

## Definition of done (every phase)
- Works end-to-end against the real Neon DB, not mock data
- Loading / empty / error states designed
- Checked at mobile width
- One line added to PROJECT.md's changelog describing what shipped

## Session start ritual
Read this file and PROJECT.md's current phase before doing anything. If the
current phase is ambiguous, ask which phase we're in rather than guessing.
Work only within that phase's scope unless told otherwise.