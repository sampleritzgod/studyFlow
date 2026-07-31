import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { env } from "@/config/env";

// Neon production-branch URLs are set as Vercel env vars in the Deploy step.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function connectionString() {
  // channel_binding can break some serverless/pg stacks; Neon works without it.
  return env.databaseUrl
    .replace(/&?channel_binding=require/gi, "")
    .replace(/\?&/, "?")
    .replace(/\?$/, "");
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: connectionString() });
  return new PrismaClient({ adapter });
}

/** Lazy so route handlers can catch missing DATABASE_URL / connect errors. */
export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/** Proxy keeps existing `import { prisma }` call sites working with lazy init. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
