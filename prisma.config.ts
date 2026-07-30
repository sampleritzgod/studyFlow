import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Single local secrets file (Next.js + Prisma CLI).
config({ path: ".env.local" });

// Prisma CLI (migrate, introspect, studio) must use Neon's direct (non-pooled) URL.
// Runtime queries use DATABASE_URL (pooled) via @prisma/adapter-pg in src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
