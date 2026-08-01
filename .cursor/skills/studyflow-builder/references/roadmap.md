# StudyFlow roadmap — Phase 0–8

Source of truth for *status* is `PROJECT.md`, not this file. This is the plan: scope, sequenced tasks, and definition of done per phase.

Build discipline (one open phase, verify before advancing, no over-engineering) comes from [phased-project-execution](../../phased-project-execution/SKILL.md) — always apply it while executing tasks here.

Every phase also inherits the global done bar from `CLAUDE.md`: real Neon data (not mocks), loading / empty / error states, checked at 375px mobile width, one changelog line in `PROJECT.md`.

---

## Phase 0 — Foundation

**Scope:** Auth is already on Clerk. Finish Neon + Prisma wiring so local app proves auth + DB against real Postgres.

**Tasks:**
1. Confirm Neon development branch + `DATABASE_URL` / `DIRECT_URL` in `.env.local`
2. Prisma 7 schema + `prisma.config.ts` (connection config lives here, not in `schema.prisma`)
3. Prisma client singleton via `@prisma/adapter-pg`
4. `/api/health` that actually queries the DB
5. Signed-in `/dashboard` surface showing Auth protected + Database connected
6. Verify: `npm run db:generate`, `typecheck`, `lint`, `build`

**Done when:** `npm run db:generate`, `npm run typecheck`, `npm run lint`, and `npm run build` pass; `/api/health` returns 200 with `database.ok: true`; signed-in `/dashboard` shows Auth protected and Database connected.

---

## Phase 1 — Deploy skeleton

**Scope:** Bare app live on Vercel + real Neon production branch, before any product features.

**Tasks:**
1. Create Vercel project; set env vars (Clerk + Neon production branch)
2. Deploy; confirm production build uses npm (not pnpm)
3. Verify public `/` loads on the deployment URL
4. Verify deployed `/api/health` → 200 with `database.ok: true` against production Neon
5. Verify Clerk sign-in / sign-up on the deployed app
6. Verify unsigned `/dashboard` redirects to sign-in; signed-in dashboard works

**Done when:** Vercel deployment URL loads; Clerk sign-in/sign-up work on the deployed app; `/dashboard` works after login; deployed `/api/health` returns 200 against the production Neon branch.

---

## Phase 2 — Notes / PKM

**Scope:** CRUD, bidirectional links, graph view — persisted on Neon.

**Tasks:**
1. Prisma models for notes + links (user-scoped); migrate against Neon
2. Notes list + create flows with loading / empty / error states
3. Note read / update / delete against real DB
4. Bidirectional linking between notes
5. Basic graph view of note relationships
6. Mobile check at 375px; verify persistence after refresh

**Done when:** A signed-in user can create, read, update, delete, and link notes with persisted data and designed loading, empty, and error states.

---

## Phase 3 — Deep work tracker

**Scope:** Pomodoro, time-blocking, focus scorecard — persisted sessions.

**Tasks:**
1. Prisma models for focus sessions / blocks
2. Runnable Pomodoro (or equivalent) session UI that saves real sessions
3. Session history list (loading / empty / error)
4. Basic focus scorecard from persisted data
5. Mobile check at 375px

**Done when:** A signed-in user can run real focus sessions, see saved history, and review a basic focus scorecard from persisted data.

---

## Phase 4 — Monetization scaffolding

**Status:** Deferred (2026-08-01). Stripe is not applicable for India. Payments and
subscriptions are skipped for now. If reopened later, prefer **Razorpay** — ask
before adding any payment SDK.

**Scope (when reopened):** Checkout + plan gating without blocking free Notes/Focus.

**Done when (when reopened):** Real provider checkout + webhook-updated plan state in Neon,
with Notes + Focus still free.

---

## Phase 5 — Career portfolio

**Scope:** Milestones and checklists with persisted progress.

**Tasks:**
1. Prisma models for milestones / checklist items
2. CRUD for milestones + checklist items
3. Progress display from persisted state
4. Loading / empty / error + mobile check

**Done when:** A signed-in user can maintain portfolio milestones and checklists with persisted progress.

---

## Phase 6 — Personal outreach CRM

**Scope:** Relationship tracker + AI-drafted emails for the user's own contacts. Peer-matching stays out of scope (needs a real user base — Phase 8).

**Tasks:**
1. Prisma models for contacts / outreach notes
2. Contact CRUD + relationship notes
3. AI-drafted outreach email for a saved contact (ask before adding any new AI SDK/provider)
4. Loading / empty / error + mobile check

**Done when:** A signed-in user can track contacts and draft outreach emails for their own saved contacts; peer matching remains out of scope.

---

## Phase 7 — Production hardening

**Scope:** Production safety basics. Some items in older notes (Secrets Manager, CloudWatch, SES) reflected the prior AWS path — prefer Vercel-native equivalents unless explicitly asked to revisit AWS.

**Tasks:**
1. CI pipeline (lint, typecheck, build at minimum)
2. Meaningful automated tests for critical paths
3. Rate limiting on sensitive routes
4. Privacy policy + Terms of Service pages
5. Backup strategy for Neon (confirm Neon PITR / branch backups meet the bar)
6. Deployment observability (Vercel logs / error tracking — ask before adding a new vendor)

**Done when:** Production safety basics are in place: CI, tests, backups, privacy/terms pages, rate limiting, and deployment observability.

---

## Phase 8 — Peer-matching

**Scope:** Only once there is a real user base to match against. Do not start early.

**Tasks:**
1. Confirm enough real usage exists to justify matching (ask; don't assume)
2. Opt-in peer discovery + matching against real users
3. Safety / privacy controls for discovery
4. Loading / empty / error + mobile check

**Done when:** There is enough real usage to justify matching and users can opt into peer discovery safely.
)
