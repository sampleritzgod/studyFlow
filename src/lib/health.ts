import { getPrisma } from "@/lib/prisma";

export type DatabaseHealth =
  | {
      ok: true;
      checkedAt: string;
      latencyMs: number;
    }
  | {
      ok: false;
      checkedAt: string;
      latencyMs: number;
      error: string;
    };

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startedAt = Date.now();

  try {
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;

    return {
      ok: true,
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      ok: false,
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}
