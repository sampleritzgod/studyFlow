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
- Next.js 15 (App Router) + React 19 + TypeScript, npm, Tailwind v4
- Auth: Clerk (@clerk/nextjs)
- DB: Neon (managed Postgres), Prisma 7 with @prisma/adapter-pg
- Deploy target: Vercel

## Roadmap — current phase governs scope
Current open phase: **2 — Notes/PKM**. Do not start Phase 3 until Phase 2 is
verified with real persisted notes and PROJECT.md is updated.

0. Foundation (auth done; finish Neon + Prisma wiring)
1. Deploy skeleton — bare app live on Vercel + real Neon DB, before any features
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

## Phase gates
- Phase 0 is done when `npm run db:generate`, `npm run typecheck`,
  `npm run lint`, and `npm run build` pass; `/api/health` returns 200 with
  `database.ok: true`; and a signed-in `/dashboard` shows Auth protected and
  Database connected.
- Phase 1 is done when the Vercel deployment URL loads, Clerk sign-in/sign-up
  work on the deployed app, `/dashboard` works after login, and the deployed
  `/api/health` returns 200 against the production Neon branch.
- Phase 2 is done when a signed-in user can create, read, update, delete, and
  link notes with persisted data and designed loading, empty, and error states.
- Phase 3 is done when a signed-in user can run real focus sessions, see saved
  history, and review a basic focus scorecard from persisted data.
- Phase 4 is done when pricing and plan gates exist with Stripe test-mode
  checkout and webhook verification, without blocking the free Phase 2/3 core.
- Phase 5 is done when a signed-in user can maintain portfolio milestones and
  checklists with persisted progress.
- Phase 6 is done when a signed-in user can track contacts and draft outreach
  emails for their own saved contacts; peer matching remains out of scope.
- Phase 7 is done when production safety basics are in place: CI, tests,
  backups, privacy/terms pages, rate limiting, and deployment observability.
- Phase 8 is done when there is enough real usage to justify matching and users
  can opt into peer discovery safely.

## Session start ritual
Read this file and PROJECT.md's current phase before doing anything. If the
current phase is ambiguous, ask which phase we're in rather than guessing.
Work only within that phase's scope unless told otherwise.
