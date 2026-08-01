# StudyFlow

Minimal, modern learning platform. Auth via Clerk; hosting on Vercel; database on Neon.

---

## Goal

Build **StudyFlow** as a clean, fast study/learning product:

- UI quality comparable to strong modern learning apps (minimal, clear hierarchy, generous space)
- Follow design **principles**, do not copy any specific brand or layout
- Stable stack only, scalable structure, no over-engineering
- Auth via **Clerk**; hosting on **Vercel**; database on **Neon** (managed Postgres)

---

## Done so far

### 1. Project initialization

- Next.js 15 (App Router) + React 19 + TypeScript
- npm, Tailwind CSS v4
- ESLint + Prettier
- Typed env via `src/config/env.ts`
- Scripts: `dev`, `build`, `start`, `lint`, `format`, `typecheck`
- Modular folders: `app`, `components`, `config`, `lib`, `types`

### 2. Authentication

- **Clerk** (`@clerk/nextjs`) — sign-in / sign-up / session
- Clerk middleware is installed globally
- Dashboard protects itself server-side with `auth.protect()`
- Pages: `/`, `/sign-in`, `/sign-up`, `/dashboard`
- **Status: swapped from Cognito/Auth.js — configure Clerk keys in `.env.local`**

### 3. Database setup (infrastructure)

- **Neon** (managed Postgres) — development branch for local, production branch for Deploy
- Prisma 7 + `@prisma/adapter-pg`
- `DATABASE_URL` = pooled (runtime); `DIRECT_URL` = direct (migrations / Prisma CLI)
- Runtime URL handling removes `channel_binding` and normalizes `sslmode=require` to
  `sslmode=verify-full`
- No app models yet (schema is generator + datasource only)
- Scripts: `db:generate`, `db:migrate`, `db:deploy`, `db:push`, `db:studio`
- No local Docker Postgres; no Aurora/RDS/VPC provisioning

---

## Roadmap (phases 0–8)

Current open phase: **none — roadmap complete except deferred items**.

| Phase | Scope | Status |
|------|--------|--------|
| 0 | Foundation (auth done; finish Neon + Prisma wiring) | **Done** — verified 2026-08-01 |
| 1 | Deploy skeleton — bare app live on Vercel + real Neon DB, before any features | **Done** — verified 2026-08-01 |
| 2 | Notes/PKM — CRUD, bidirectional links, graph view | **Done** — verified 2026-08-01 |
| 3 | Deep work tracker — Pomodoro, time-blocking, focus scorecard | **Done** — verified 2026-08-01 |
| 4 | Monetization scaffolding — payments / plan gating | **Deferred** — Stripe not India-viable; Razorpay later if reopened |
| 5 | Career portfolio — milestones, checklists | **Done** — verified 2026-08-01 |
| 6 | Personal outreach CRM — relationship tracker + drafted emails | **Done** — verified 2026-08-01 |
| 7 | Production hardening — CI, rate limiting, privacy/ToS, backups, observability | **Done** — verified 2026-08-01 |
| 8 | Peer-matching — only once there's a real user base to match against | **Blocked** — needs real users; do not start early |

---

## Current phase gate

Phase 0 closed (2026-08-01): local generate/typecheck/lint/build; `/api/health` 200; auth redirect.

Phase 1 closed (2026-08-01) — live URL [https://studyflow-kappa-two.vercel.app](https://studyflow-kappa-two.vercel.app):

- `/` → HTTP 200
- Deployed `/api/health` → HTTP 200 with `database.ok: true`
- Unsigned `/dashboard` → HTTP 307 to `/sign-in`
- Signed-in `/dashboard` shows Authentication **Protected** and Database **Connected**

Phase 2 closed (2026-08-01): signed-in notes CRUD + links + graph against Neon; components (`Button`, `Field`, `PageHeader`, `EmptyState`); `npm test` / typecheck / lint / build pass.

Phase 3 closed (2026-08-01): FocusSession on Neon; `/focus` Pomodoro + blocks + history + 7-day scorecard; helper tests + build gates green.

Phase 4 deferred (2026-08-01): Stripe removed (not applicable for India). Payments/subscriptions skipped for now; Razorpay only if this phase is reopened later. `/pricing` explains the deferral. Notes + Focus remain free.

Phase 5 closed (2026-08-01): portfolio milestones + checklists with persisted progress on Neon.

Phase 6 closed (2026-08-01): contacts + relationship notes + template outreach drafts on Neon.

Phase 7 closed (2026-08-01): GitHub CI; `/privacy` + `/terms`; `/api/health` rate limit; Neon backup + Vercel log notes in PROJECT.md. Live checks: privacy/terms/health 200.

Phase 8 remains **blocked** until there is a real multi-user base to match against. Do not build peer-matching early.

---

## Stack decisions

| Concern | Choice | Why (one line) |
|---------|--------|----------------|
| App | Next.js 15 + TypeScript | Stable fullstack web app |
| Auth | Clerk | Hosted auth UI + Next.js middleware helpers |
| Database | Neon (managed Postgres) | Simple managed Postgres |
| ORM | Prisma 7 + `@prisma/adapter-pg` | Client singleton in `src/lib/prisma.ts` |
| Deploy | Vercel | Next.js hosting; Amplify removed |

---

## Local run

```bash
npm install
# Copy .env.example → .env.local and fill Clerk + Neon development-branch values
npm run db:generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Sign in** uses Clerk.

Secrets live only in `.env.local` (gitignored). `.env.example` is the committed template.

---

## Working rules

- Build one step at a time
- Do not implement future features early
- Ask when requirements are unclear
- Prefer simple, production-ready choices

---

## Changelog

- 2026-08-01: Closed Phase 7 — CI workflow, privacy/terms pages, health rate limit, Neon/Vercel ops notes.
- 2026-08-01: Closed Phase 6 — Outreach CRM (contacts, notes, template email drafts) on Neon.
- 2026-08-01: Closed Phase 5 — Career portfolio milestones + checklists with progress on Neon.
- 2026-08-01: Deferred Phase 4 monetization — removed Stripe; payments/subscriptions skipped (India); Razorpay postponed.
- 2026-08-01: Closed Phase 3 — Deep work tracker (Pomodoro, time blocks, history, focus scorecard) on Neon.
- 2026-08-01: Closed Phase 2 — Notes/PKM CRUD, bidirectional links, graph view; reusable UI components; helper tests green.
- 2026-08-01: Closed Phase 1 — skeleton live at studyflow-kappa-two.vercel.app (Clerk + Neon production health green).
- 2026-08-01: Closed Phase 0 — Prisma/Neon health wiring verified (`db:generate`, typecheck, lint, build, `/api/health` 200).
- 2026-08-01: Added a phase-0 dashboard foundation check backed by the real Prisma/Neon health query.
- 2026-07-31: Replaced Cognito/Auth.js with Clerk; removed Amplify config; deploy target is Vercel.

---

## Next step

No open build phase. Optional later: reopen **Phase 4 with Razorpay**, or **Phase 8 peer-matching** only after real users exist. Meanwhile: push to GitHub so CI runs, and deploy latest `main` to Vercel (run `prisma migrate deploy` on production Neon).

## Ops notes

- **Backups:** Neon provides point-in-time recovery / history on paid plans and branch-based copies. Confirm the production project’s restore window in the Neon console and keep a named production branch.
- **Observability:** Use Vercel deployment logs and Clerk logs for now. Do not add Sentry/Datadog unless explicitly requested.
