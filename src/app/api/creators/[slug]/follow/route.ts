import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getCreator } from "@/lib/courses";
import { apiError, handleApiError } from "@/lib/http";
import { Follow } from "@/models/Follow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/creators/:slug/follow: toggles following for the signed-in user. */
export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await getSession();
    if (!user) return apiError(401, "Please log in to follow creators.");

    const { slug } = await params;
    if (!(await getCreator(slug))) return apiError(404, "Creator not found.");

    await connectDB();
    const existing = await Follow.findOneAndDelete({ userId: user.id, creatorSlug: slug });
    let following = false;
    if (!existing) {
      await Follow.updateOne({ userId: user.id, creatorSlug: slug }, { $setOnInsert: { userId: user.id, creatorSlug: slug } }, { upsert: true });
      following = true;
    }
    const followers = (await getCreator(slug))?.followers ?? 0;
    return NextResponse.json({ ok: true, following, followers });
  } catch (err) {
    return handleApiError(err);
  }
}
