import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { formatPrice, cn } from "@/lib/utils";
import type { CourseDTO } from "@/lib/types";

function LevelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="text-ink">
      <rect x="1" y="7.5" width="2.6" height="5" rx="1.3" fill="currentColor" />
      <rect x="5.7" y="4.5" width="2.6" height="8" rx="1.3" fill="currentColor" />
      <rect x="10.4" y="1.5" width="2.6" height="11" rx="1.3" fill="currentColor" opacity=".25" />
    </svg>
  );
}

export function CourseCard({
  course,
  priority,
  countTone = "lime",
  interactive = true,
  className,
}: {
  course: CourseDTO;
  priority?: boolean;
  countTone?: "lime" | "black";
  /** Set false for purely decorative cards (no links, not focusable). */
  interactive?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "relative rounded-3xl border border-line bg-white p-4 text-ink",
        interactive && "transition-shadow focus-within:ring-2 focus-within:ring-brand hover:shadow-float",
        className,
      )}
    >
      <div className="relative h-[195px] overflow-hidden rounded-2xl bg-pill">
        <Image
          src={course.image}
          alt={`${course.title} course thumbnail`}
          fill
          sizes="(min-width:1024px) 340px, (min-width:640px) 45vw, 90vw"
          priority={priority}
          className="object-cover"
        />
        <ul className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2 text-xs text-ink/80">
          {[`${course.lessons} Lessons`, course.duration, `${course.comments} Comments`].map((t) => (
            <li key={t} className="whitespace-nowrap rounded-full bg-[#d9d9d9]/75 px-3 py-1.5 backdrop-blur-[2px]">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="min-w-0 truncate font-display text-xl font-semibold leading-tight" title={course.title}>
          {interactive ? (
            <Link href={`/courses/${course.slug}`} className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-['']">
              {course.title}
            </Link>
          ) : (
            course.title
          )}
        </h3>
        <span className="flex shrink-0 items-center gap-1 pt-0.5 text-lg leading-none text-mute">
          {course.rating.toFixed(1)}
          <Star size={17} className={countTone === "lime" ? "fill-line text-line" : "fill-lime text-lime"} aria-label="rating" />
        </span>
      </div>
      <p className="mt-0.5 text-xs text-mute">
        by{" "}
        {interactive ? (
          <Link href={`/creators/${course.creatorSlug}`} className="relative z-10 text-brand hover:underline">
            {course.creator}
          </Link>
        ) : (
          <span className="text-brand">{course.creator}</span>
        )}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-pill px-3.5 py-2 text-[13px] leading-none">
          <LevelIcon />
          {course.level}
        </span>
        <AvatarStack count={`${course.enrolled}+`} countTone={countTone} size={34} />
      </div>

      <p className="mt-4 text-xs text-mute">
        <span className="font-display text-xl font-semibold text-brand">{formatPrice(course.price)}</span>/lifetime
      </p>
    </article>
  );
}
