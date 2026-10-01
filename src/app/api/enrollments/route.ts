import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getCourseDetail } from "@/lib/courses";
import { apiError, handleApiError, parseBody } from "@/lib/http";
import { Enrollment } from "@/models/Enrollment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ slug: z.string().min(1).max(120) });

/** POST /api/enrollments { slug }: enroll the signed-in user (idempotent). */
export async function POST(req: Request) {
  try {
    const user = await getSession();
    if (!user) return apiError(401, "Please log in to enroll.");

    const body = await parseBody(req, schema);
    if (body.error) return body.error;

    if (!(await getCourseDetail(body.data.slug))) return apiError(404, "Course not found.");

    await connectDB();
    await Enrollment.updateOne(
      { userId: user.id, courseSlug: body.data.slug },
      { $setOnInsert: { userId: user.id, courseSlug: body.data.slug, completedModules: [] } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true, enrolled: true });
  } catch (err) {
    return handleApiError(err);
  }
}
