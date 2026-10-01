import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Stars } from "@/components/ui/Stars";
import { pillClass } from "@/components/course/pill";
import { getCourseDetail } from "@/lib/courses";
import { filterReviews, ratingDistribution } from "@/lib/review-data";

export const metadata: Metadata = { title: "Reviews" };

export default async function CourseReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ rating?: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseDetail(slug);
  if (!course) notFound();

  const raw = Number((await searchParams).rating);
  const rating = Number.isInteger(raw) && raw >= 1 && raw <= 5 ? raw : 0;
  const reviews = filterReviews(rating);
  const dist = ratingDistribution(course.reviewCount);
  const max = Math.max(...dist, 1);
  const base = `/courses/${slug}/reviews`;

  return (
    <div>
      <h2 className="mt-10 font-display text-[22px] font-medium">What Learners Are Saying</h2>
      <p className="mt-4 text-base leading-[1.7] text-[#4b4c53]">
        Discover what our learners have to say about their experience with &lsquo;{course.headline}.&rsquo; Read
        reviews and ratings from individuals who have embarked on the transformative journey of mastering this subject.
      </p>

      <section aria-label="Rating summary" className="mt-6 flex flex-col gap-8 rounded-3xl border border-line p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="grid h-[140px] w-[140px] shrink-0 place-items-center rounded-2xl bg-lime text-center">
          <div>
            <p className="text-sm">Ratings</p>
            <p className="font-display text-[40px] font-medium leading-tight">{course.rating.toFixed(1)}</p>
          </div>
        </div>
        <ul className="min-w-0 flex-1 space-y-2">
          {dist.map((count, i) => (
            <li key={i} className="flex items-center gap-4">
              <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#e6e6e6]">
                <span className="block h-full rounded-full bg-lime" style={{ width: `${Math.max((count / max) * 100, 3)}%` }} />
              </span>
              <Stars value={5 - i} size={17} className="hidden sm:inline-flex" />
              <span className="w-9 text-right text-[15px] text-[#4b4c53]">
                <span className="sm:hidden">{5 - i}★ </span>
                {count}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <h3 className="mt-10 font-display text-[22px] font-medium">Individual Reviews:</h3>
      <nav aria-label="Filter reviews by rating" className="mt-5 flex flex-wrap gap-3">
        <Link href={base} scroll={false} aria-current={!rating ? "true" : undefined} className={pillClass(!rating)}>
          All rating
        </Link>
        {[5, 4, 3, 2, 1].map((n) => (
          <Link key={n} href={`${base}?rating=${n}`} scroll={false} aria-current={rating === n ? "true" : undefined} className={pillClass(rating === n, "gap-2")}>
            <Star size={17} className="fill-[#4b4c53] text-[#4b4c53]" aria-hidden /> {n}
          </Link>
        ))}
      </nav>

      {reviews.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-line px-6 py-12 text-center text-mute">
          No {rating}-star reviews yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-6">
          {reviews.map((r) => (
            <li key={r.id}>
              <article className="rounded-3xl border border-line p-6 sm:p-8">
                <header className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Image src={r.avatar} alt="" width={96} height={96} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className="text-lg leading-tight">{r.name}</p>
                      <p className="text-base text-[#4b4c53]">{r.role}</p>
                    </div>
                  </div>
                  <p className="shrink-0 text-base text-[#4b4c53]">{r.when}</p>
                </header>
                <Stars value={r.rating} size={22} className="mt-5" />
                <p className="mt-5 text-base leading-[1.75] text-[#4b4c53]">{r.comment}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
