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

Current open phase: **0 — Foundation**.

| Phase | Scope | Status |
|------|--------|--------|
| 0 | Foundation (auth done; finish Neon + Prisma wiring) | **In progress** — auth on Clerk; Neon/Prisma health check is wired |
| 1 | Deploy skeleton — bare app live on Vercel + real Neon DB, before any features | Not started |
| 2 | Notes/PKM — CRUD, bidirectional links, graph view | Not started |
| 3 | Deep work tracker — Pomodoro, time-blocking, focus scorecard | Not started |
| 4 | Monetization scaffolding — Stripe, pricing, plan gating | Not started |
| 5 | Career portfolio — milestones, checklists | Not started |
| 6 | Personal outreach CRM — relationship tracker + AI-drafted emails | Not started |
| 7 | Production hardening — Secrets Manager, CloudWatch, SES, rate limiting, backups, privacy policy/ToS, CI with tests | Not started |
| 8 | Peer-matching — only once there's a real user base to match against | Not started |

---

## Current phase gate

Phase 0 is not complete until the following evidence exists:

- Done: `npm run db:generate` passes
- Done: `npm run typecheck` passes
- Done: `npm run lint` passes
- Done: `npm run build` passes
- Done before URL-normalization cleanup: local `/api/health` returned HTTP 200
  with `database.ok: true`
- Pending: repeat local `/api/health` after URL-normalization cleanup
- Pending: a signed-in `/dashboard` shows Auth protected and Database connected
- Pending: changelog includes the shipped Phase 0 line

Latest command evidence was collected on 2026-08-01. Unsigned `/dashboard`
redirected to `/sign-in?redirect_url=...`, confirming route protection behavior
without a browser session.

---

## Stack decisions

| Concern | Choice | Why (one line) |
|---------|--------|----------------|
| App | Next.js 15 + TypeScript | Stable fullstack web app |
| Auth | Clerk | Hosted auth UI + Next.js middleware helpers |
| Database | Neon (managed Postgres) | Simple managed Postgres |
| ORM | Prisma 7 + `@prisma/adapter-pg` | Client singleton in `src/lib/prisma.ts` |
| Deploy (planned) | Vercel | Next.js hosting; Amplify removed |

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

- 2026-08-01: Added a phase-0 dashboard foundation check backed by the real Prisma/Neon health query.
- 2026-07-31: Replaced Cognito/Auth.js with Clerk; removed Amplify config; deploy target is Vercel.

---

## Next step

Finish **phase 0** (Neon + Prisma wiring), then phase 1 only after that is done.
