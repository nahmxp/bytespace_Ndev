"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CourseGrid } from "@/components/course/CourseGrid";
import { EmptyState } from "@/components/course/EmptyState";
import { pillClass } from "@/components/course/pill";
import { MORE_CATEGORIES, PRIMARY_CATEGORIES } from "@/lib/categories";
import type { CourseDTO } from "@/lib/types";

const PAGE_SIZE = 6;

export function CourseExplorer({ initialCourses, initialTotal }: { initialCourses: CourseDTO[]; initialTotal: number }) {
  const [active, setActive] = useState("featured");
  const [courses, setCourses] = useState(initialCourses);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const latest = useRef(0);

  const pills = showMore ? [...PRIMARY_CATEGORIES, ...MORE_CATEGORIES] : PRIMARY_CATEGORIES;

  async function select(slug: string) {
    if (slug === active) return;
    setActive(slug);
    setError(null);
    setLoading(true);
    const id = ++latest.current;
    try {
      const res = await fetch(`/api/courses?category=${encodeURIComponent(slug)}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      if (id !== latest.current) return; // a newer click won
      setCourses(data.courses);
      setTotal(data.total);
    } catch {
      if (id === latest.current) setError("Couldn't load courses. Check your connection and try again.");
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }

  return (
    <div>
      <div role="group" aria-label="Course categories" className="mx-auto flex max-w-page flex-wrap justify-center gap-x-4 gap-y-5">
        {pills.map((c) => (
          <button
            key={c.slug}
            type="button"
            aria-pressed={c.slug === active}
            onClick={() => select(c.slug)}
            className={pillClass(c.slug === active)}
          >
            {c.label}
          </button>
        ))}
        {!showMore && (
          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="inline-flex h-11 items-center px-3 text-base text-brand hover:underline"
          >
            + More
          </button>
        )}
      </div>

      <div className="mx-auto mt-14 max-w-page" aria-live="polite" aria-busy={loading}>
        {error ? (
          <p role="alert" className="rounded-2xl bg-red-50 p-6 text-center text-red-700">
            {error}
          </p>
        ) : courses.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <div className={loading ? "opacity-50 transition-opacity" : "transition-opacity"}>
            <CourseGrid courses={courses} />
          </div>
        )}

        {total > PAGE_SIZE && !error && (
          <div className="mt-10 text-center">
            <Link href={`/courses?category=${active}`} className="text-brand hover:underline">
              View all {total} courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
