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

Current open phase: **2 — Notes/PKM**.

| Phase | Scope | Status |
|------|--------|--------|
| 0 | Foundation (auth done; finish Neon + Prisma wiring) | **Done** — verified 2026-08-01 |
| 1 | Deploy skeleton — bare app live on Vercel + real Neon DB, before any features | **Done** — verified 2026-08-01 |
| 2 | Notes/PKM — CRUD, bidirectional links, graph view | **In progress** |
| 3 | Deep work tracker — Pomodoro, time-blocking, focus scorecard | Not started |
| 4 | Monetization scaffolding — Stripe, pricing, plan gating | Not started |
| 5 | Career portfolio — milestones, checklists | Not started |
| 6 | Personal outreach CRM — relationship tracker + AI-drafted emails | Not started |
| 7 | Production hardening — Secrets Manager, CloudWatch, SES, rate limiting, backups, privacy policy/ToS, CI with tests | Not started |
| 8 | Peer-matching — only once there's a real user base to match against | Not started |

---

## Current phase gate

Phase 0 closed (2026-08-01): local generate/typecheck/lint/build; `/api/health` 200; auth redirect.

Phase 1 closed (2026-08-01) — live URL [https://studyflow-kappa-two.vercel.app](https://studyflow-kappa-two.vercel.app):

- `/` → HTTP 200
- Deployed `/api/health` → HTTP 200 with `database.ok: true`
- Unsigned `/dashboard` → HTTP 307 to `/sign-in`
- Signed-in `/dashboard` shows Authentication **Protected** and Database **Connected**

Phase 2 is not complete until a signed-in user can create, read, update, delete, and link notes with persisted data and designed loading, empty, and error states.

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

- 2026-08-01: Closed Phase 1 — skeleton live at studyflow-kappa-two.vercel.app (Clerk + Neon production health green).
- 2026-08-01: Closed Phase 0 — Prisma/Neon health wiring verified (`db:generate`, typecheck, lint, build, `/api/health` 200).
- 2026-08-01: Added a phase-0 dashboard foundation check backed by the real Prisma/Neon health query.
- 2026-07-31: Replaced Cognito/Auth.js with Clerk; removed Amplify config; deploy target is Vercel.

---

## Next step

**Phase 2 — Notes/PKM (in progress):** verify locally — create/edit/delete/link notes at `/notes`, open `/notes/graph`, confirm data survives refresh. Then run `npx prisma migrate deploy` against **production** Neon before expecting notes on Vercel.
