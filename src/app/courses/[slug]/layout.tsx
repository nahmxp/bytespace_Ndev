import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Star, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CourseSidebar } from "@/components/course-page/CourseSidebar";
import { CourseTabs } from "@/components/course-page/CourseTabs";
import { ShareButton } from "@/components/course-page/ShareButton";
import { getSession } from "@/lib/auth";
import { getCourseDetail, getCreator } from "@/lib/courses";
import { getEnrollmentState } from "@/lib/engagement";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const course = await getCourseDetail((await params).slug);
  if (!course) return { title: "Course not found" };
  return { title: course.headline, description: course.subtitle };
}

function LevelBars() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true" className="text-brand">
      <rect x="1" y="7.5" width="2.6" height="5" rx="1.3" fill="currentColor" />
      <rect x="5.7" y="4.5" width="2.6" height="8" rx="1.3" fill="currentColor" />
      <rect x="10.4" y="1.5" width="2.6" height="11" rx="1.3" fill="currentColor" />
    </svg>
  );
}

export default async function CourseLayout({ children, params }: Params & { children: React.ReactNode }) {
  const { slug } = await params;
  const course = await getCourseDetail(slug);
  if (!course) notFound();

  const session = await getSession().catch(() => null);
  const [creator, enrollment] = await Promise.all([getCreator(course.creatorSlug), getEnrollmentState(session?.id, slug)]);

  const chip = "inline-flex h-10 items-center gap-2.5 rounded-full bg-white px-5 text-base text-ink";

  return (
    <>
      <div className="bg-grid on-blue pb-24 text-white lg:pb-[599px]">
        <Navbar />
        <div className="mx-auto max-w-page px-5 pt-2 md:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[28px] font-semibold leading-[1.15] sm:text-4xl">{course.headline}</h1>
              <p className="mt-1 font-display text-lg font-semibold leading-snug sm:text-xl">{course.subtitle}</p>
            </div>
            <ShareButton title={course.headline} />
          </div>
          <p className="mt-5 text-lg">
            by{" "}
            <Link href={`/creators/${course.creatorSlug}`} className="text-lime hover:underline">
              {course.creator}
            </Link>
          </p>
          <ul className="mt-5 flex flex-wrap gap-4">
            <li className={chip}>
              <LevelBars />
              {course.level}
            </li>
            <li className={chip}>
              <Star size={17} className="fill-brand text-brand" aria-hidden />
              {course.rating.toFixed(1)} ({course.reviewCount} reviews)
            </li>
            <li className={chip}>
              <Users size={18} className="text-brand" aria-hidden />
              {course.students} Students
            </li>
          </ul>
        </div>
      </div>

      <main className="relative mx-auto -mt-16 grid max-w-page gap-x-16 gap-y-10 px-5 pb-20 lg:-mt-[540px] lg:grid-cols-[minmax(0,1fr)_412px] lg:grid-rows-[auto_1fr]">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] bg-pill shadow-float">
            <Image src={course.hero} alt={`${course.headline} preview`} fill priority sizes="(min-width:1024px) 720px, 100vw" className="object-cover" />
            <Link
              href={`/courses/${slug}/lessons`}
              aria-label="Preview the lessons"
              className="absolute left-1/2 top-1/2 grid h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[26px] bg-black/35 backdrop-blur-md transition-colors hover:bg-black/50"
            >
              <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white/90 text-ink">
                <Play size={22} className="ml-0.5 fill-ink" aria-hidden />
              </span>
            </Link>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <CourseSidebar course={course} creator={creator} loggedIn={!!session} enrolled={enrollment.enrolled} />
        </div>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:pt-6">
          <CourseTabs slug={slug} />
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
