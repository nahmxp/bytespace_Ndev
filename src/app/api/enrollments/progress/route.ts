import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getCourseDetail } from "@/lib/courses";
import { apiError, handleApiError, parseBody } from "@/lib/http";
import { Enrollment } from "@/models/Enrollment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  slug: z.string().min(1).max(120),
  module: z.number().int().min(0).max(99),
  done: z.boolean(),
});

/** POST /api/enrollments/progress { slug, module, done }: mark a module complete / incomplete. */
export async function POST(req: Request) {
  try {
    const user = await getSession();
    if (!user) return apiError(401, "Please log in to track your progress.");

    const body = await parseBody(req, schema);
    if (body.error) return body.error;
    const { slug, module, done } = body.data;

    const course = await getCourseDetail(slug);
    if (!course) return apiError(404, "Course not found.");
    if (module >= course.modules.length) return apiError(400, "That module doesn't exist.");

    await connectDB();
    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: user.id, courseSlug: slug },
      done ? { $addToSet: { completedModules: module } } : { $pull: { completedModules: module } },
      { new: true },
    ).lean();
    if (!enrollment) return apiError(403, "Enroll in this course first.");

    return NextResponse.json({ ok: true, completed: [...enrollment.completedModules].sort((a, b) => a - b) });
  } catch (err) {
    return handleApiError(err);
  }
}
