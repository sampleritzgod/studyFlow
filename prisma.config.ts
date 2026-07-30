import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Secrets live in `.env.local` (not `.env`). Load that before Prisma config.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    // Migrations need Neon's direct (non-pooled) URL.
    url: env("DIRECT_URL"),
  },
});
