import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonsTracker } from "@/components/course-page/LessonsTracker";
import { getSession } from "@/lib/auth";
import { getCourseDetail } from "@/lib/courses";
import { getEnrollmentState } from "@/lib/engagement";

export const metadata: Metadata = { title: "Lessons" };
export const dynamic = "force-dynamic";

export default async function CourseLessonsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseDetail(slug);
  if (!course) notFound();

  const session = await getSession().catch(() => null);
  const enrollment = await getEnrollmentState(session?.id, slug);

  return (
    <div>
      <h2 className="mt-10 font-display text-[22px] font-medium">Explore the Modules</h2>
      <p className="mt-4 text-base leading-[1.7] text-[#4b4c53]">
        Immerse yourself in the course content as we break down each module into comprehensive lessons, providing
        practical insights and hands-on experiences.
      </p>
      <LessonsTracker
        slug={slug}
        modules={course.modules}
        enrolled={enrollment.enrolled}
        loggedIn={!!session}
        initialCompleted={enrollment.completed}
      />
    </div>
  );
}
