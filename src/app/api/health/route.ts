import { checkDatabaseHealth } from "@/lib/health";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit(`health:${ip}`, 60, 60_000);

  if (!limit.allowed) {
    return NextResponse.json(
      { status: "error", error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSeconds),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  const database = await checkDatabaseHealth();

  return NextResponse.json(
    {
      status: database.ok ? "ok" : "error",
      database,
    },
    {
      status: database.ok ? 200 : 500,
      headers: {
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    },
  );
}
