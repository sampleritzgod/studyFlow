# StudyFlow

Minimal, modern learning platform. Production-first on AWS (auth/hosting) + Neon (database).

---

## Goal

Build **StudyFlow** as a clean, fast study/learning product:

- UI quality comparable to strong modern learning apps (minimal, clear hierarchy, generous space)
- Follow design **principles**, do not copy any specific brand or layout
- Stable stack only, scalable structure, no over-engineering
- Auth/hosting on **AWS**; database on **Neon** (managed Postgres)

---

## Done so far

### 1. Project initialization

- Next.js 15 (App Router) + React 19 + TypeScript
- pnpm, Tailwind CSS v4
- ESLint + Prettier
- Typed env via `src/config/env.ts`
- Scripts: `dev`, `build`, `start`, `lint`, `format`, `typecheck`
- Modular folders: `app`, `components`, `config`, `lib`, `types`

### 2. Authentication

- Auth.js (`next-auth` v5) + **Amazon Cognito**
- JWT sessions (no database adapter yet)
- Cognito Hosted UI: sign-in / sign-out
- Protected route: `/dashboard`
- Pages: `/`, `/login`, `/dashboard`
- Cognito app client configured with:
  - Callback: `http://localhost:3000/api/auth/callback/cognito`
  - Sign-out: `http://localhost:3000`
  - Scopes: `openid email profile phone`
- **Status: working locally**

### 3. Database setup (infrastructure)

- **Neon** (managed Postgres) — development branch for local, production branch for Deploy
- Prisma 7 + `@prisma/adapter-pg`
- `DATABASE_URL` = pooled (runtime); `DIRECT_URL` = direct (migrations / Prisma CLI)
- No app models yet (schema is generator + datasource only)
- Scripts: `db:generate`, `db:migrate`, `db:deploy`, `db:push`, `db:studio`
- No local Docker Postgres; no Aurora/RDS/VPC provisioning

---

## Not done yet

| Area | Plan | Status |
|------|------|--------|
| App models | Courses, tracks, progress, users | Not started |
| UI polish | Landing / product UI from design principles | Not started |
| Deploy | Amplify Hosting, CloudFront + S3, CloudWatch, SES; Neon production env vars on Amplify | Not started |

---

## Stack decisions

| Concern | Choice | Why (one line) |
|---------|--------|----------------|
| App | Next.js 15 + TypeScript | Stable fullstack web app, fits AWS hosting |
| Auth | Amazon Cognito + Auth.js | Managed AWS identity with JWT and Hosted UI |
| Database | Neon (managed Postgres) | Simple managed Postgres; Cognito already covers auth |
| ORM | Prisma 7 + `@prisma/adapter-pg` | Client singleton in `src/lib/prisma.ts` |
| Deploy (planned) | Amplify + supporting AWS services | Straightforward Next.js hosting on AWS |

---

## Local run

```bash
pnpm install
# Copy .env.example → .env.local and fill Cognito + Neon development-branch values
pnpm db:generate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) → **Sign in** uses Cognito.

Secrets live only in `.env.local` (gitignored). `.env.example` is the committed template.

---

## Working rules

- Build one step at a time
- Do not implement future features early
- Ask when requirements are unclear
- Prefer simple, production-ready choices

---

## Next step

**App models** (or UI / Deploy) — after explicit approval.
