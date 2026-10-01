import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CourseGrid } from "@/components/course/CourseGrid";
import { EmptyState } from "@/components/course/EmptyState";
import { AutoSubmitSelect } from "@/components/course/AutoSubmitSelect";
import { pillClass } from "@/components/course/pill";
import { ALL_CATEGORIES, categoryLabel } from "@/lib/categories";
import { getCourses, SORT_KEYS } from "@/lib/courses";
import type { SortKey } from "@/lib/types";

export const metadata: Metadata = { title: "Courses" };
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

const SORT_LABELS: Record<SortKey, string> = {
  relevant: "Most relevant",
  newest: "Newest",
  rating: "Top rated",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

export default async function CoursesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = first(sp.q).trim().slice(0, 80);
  const category = first(sp.category).toLowerCase();
  const level = first(sp.level);
  const sort = (SORT_KEYS.includes(first(sp.sort) as SortKey) ? first(sp.sort) : "relevant") as SortKey;
  const page = Math.max(parseInt(first(sp.page), 10) || 1, 1);

  const { courses, total, pages } = await getCourses({ q, category, level, sort, page, limit: 9 });

  const href = (over: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = { q, category, level, sort: sort === "relevant" ? "" : sort, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const s = params.toString();
    return s ? `/courses?${s}` : "/courses";
  };

  const pills = [
    { slug: "", label: "All" },
    { slug: "featured", label: "Featured" },
    ...ALL_CATEGORIES.filter((c) => c.slug !== "featured"),
  ];

  return (
    <>
      <div className="bg-grid on-blue text-white">
        <Navbar />
        <div className="mx-auto max-w-page px-5 pb-16 pt-6 text-center md:pb-[72px] md:pt-8">
          <h1 className="text-[34px] font-semibold md:text-[40px]">Find Your Next Course</h1>
          <form action="/courses" method="get" role="search" className="mx-auto mt-8 flex max-w-[640px] items-center gap-3">
            {category && <input type="hidden" name="category" value={category} />}
            <label htmlFor="q" className="sr-only">
              Search courses
            </label>
            <div className="relative min-w-0 flex-1">
              <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/60" aria-hidden />
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={q}
                maxLength={80}
                placeholder="Search"
                className="h-[52px] w-full rounded-full bg-white pl-12 pr-4 text-base text-ink placeholder:text-ink/45 focus:outline-none focus-visible:ring-4 focus-visible:ring-lime/60"
              />
            </div>
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>
        </div>
      </div>

      <main className="mx-auto max-w-page px-5 pb-20 pt-10 md:pt-14">
        <form action="/courses" method="get" className="flex flex-wrap items-center justify-between gap-4">
          {q && <input type="hidden" name="q" value={q} />}
          {category && <input type="hidden" name="category" value={category} />}
          <AutoSubmitSelect
            name="level"
            label="Level"
            value={level}
            options={[{ value: "", label: "All levels" }, ...["Beginner", "Intermediate", "Advanced"].map((l) => ({ value: l, label: l }))]}
          />
          <AutoSubmitSelect
            name="sort"
            label="Sort by"
            value={sort}
            options={SORT_KEYS.map((k) => ({ value: k, label: SORT_LABELS[k] }))}
          />
          <noscript>
            <Button type="submit" variant="outline">
              Apply
            </Button>
          </noscript>
        </form>

        <nav aria-label="Categories" className="-mx-5 mt-6 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {pills.map((c) => (
            <Link
              key={c.slug || "all"}
              href={href({ category: c.slug, page: "" })}
              aria-current={category === c.slug ? "true" : undefined}
              className={pillClass(category === c.slug, "shrink-0")}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <p className="mt-10 text-mute" role="status">
          {total} {total === 1 ? "course" : "courses"}
          {category ? ` in ${categoryLabel(category)}` : ""}
          {q ? ` matching “${q}”` : ""}
        </p>

        <div className="mt-6">{courses.length ? <CourseGrid courses={courses} /> : <EmptyState query={q} />}</div>

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-3">
            {page > 1 && (
              <Link href={href({ page: String(page - 1) })} className="inline-flex h-11 items-center rounded-full border border-line px-5 hover:border-ink">
                Previous
              </Link>
            )}
            <span className="px-3 text-mute">
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Link href={href({ page: String(page + 1) })} className="inline-flex h-11 items-center rounded-full bg-lime px-5 hover:bg-lime-dark">
                Next
              </Link>
            )}
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}
