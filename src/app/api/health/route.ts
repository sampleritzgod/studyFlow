import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/health";

export const dynamic = "force-dynamic";

export async function GET() {
  const database = await checkDatabaseHealth();

  return NextResponse.json(
    {
      status: database.ok ? "ok" : "error",
      database,
    },
    { status: database.ok ? 200 : 500 },
  );
}
