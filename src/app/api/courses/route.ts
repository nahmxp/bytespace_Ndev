import { NextResponse } from "next/server";
import { getCourses } from "@/lib/courses";
import type { SortKey } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/courses?category=featured&q=figma&level=Beginner&sort=rating&page=1&limit=6 */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const num = (k: string) => {
    const v = Number(sp.get(k));
    return Number.isFinite(v) && v > 0 ? v : undefined;
  };
  const result = await getCourses({
    category: sp.get("category") ?? undefined,
    q: sp.get("q") ?? undefined,
    level: sp.get("level") ?? undefined,
    sort: (sp.get("sort") as SortKey | null) ?? undefined,
    page: num("page"),
    limit: num("limit"),
  });
  return NextResponse.json({ ok: true, ...result });
}
