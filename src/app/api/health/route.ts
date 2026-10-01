import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/health: quick check that the app and database are wired up. */
export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: true, database: "not-configured" });
  }
  try {
    await connectDB();
    return NextResponse.json({ ok: true, database: "connected" });
  } catch {
    return NextResponse.json({ ok: false, database: "unreachable" }, { status: 503 });
  }
}
