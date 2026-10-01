import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CourseGrid } from "@/components/course/CourseGrid";
import { EmptyState } from "@/components/course/EmptyState";
import { AutoSubmitSelect } from "@/components/course/AutoSubmitSelect";
import { FollowButton } from "@/components/creator/FollowButton";
import { getSession } from "@/lib/auth";
import { ALL_CATEGORIES } from "@/lib/categories";
import { getCourses, getCreator, SORT_KEYS } from "@/lib/courses";
import { getFollowState } from "@/lib/engagement";
import type { SortKey } from "@/lib/types";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const creator = await getCreator((await params).slug);
  return creator ? { title: creator.name, description: creator.headline } : { title: "Creator not found" };
}

export default async function CreatorProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SP>;
}) {
  const { slug } = await params;
  const creator = await getCreator(slug);
  if (!creator) notFound();

  const sp = await searchParams;
  const level = first(sp.level);
  const category = first(sp.category);
  const sort = (SORT_KEYS.includes(first(sp.sort) as SortKey) ? first(sp.sort) : "relevant") as SortKey;
  const page = Math.max(parseInt(first(sp.page), 10) || 1, 1);

  const session = await getSession().catch(() => null);
  const [{ courses, pages }, following] = await Promise.all([
    getCourses({ creator: slug, level, category, sort, page, limit: 9 }),
    getFollowState(session?.id, slug),
  ]);

  const pageHref = (p: number) => {
    const q = new URLSearchParams();
    if (level) q.set("level", level);
    if (category) q.set("category", category);
    if (sort !== "relevant") q.set("sort", sort);
    q.set("page", String(p));
    return `/creators/${slug}?${q}`;
  };

  return (
    <>
      <div className="bg-grid on-blue pb-16 text-white">
        <Navbar />
        <div className="mx-auto max-w-page px-5 pt-4 md:pt-10">
          <div className="flex items-start gap-5 sm:gap-6">
            <Image src={creator.avatar} alt="" width={192} height={192} priority className="h-20 w-20 shrink-0 rounded-[20px] object-cover sm:h-24 sm:w-24" />
            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h1 className="text-[30px] font-semibold leading-tight sm:text-[40px]">{creator.name}</h1>
                <span className="rounded-full bg-lime px-5 py-1.5 text-base text-ink">Creator</span>
              </div>
              <p className="mt-1 text-lg font-light">{creator.headline}</p>
            </div>
          </div>

          <div className="mt-9 max-w-[1180px] space-y-1 text-base font-light leading-[1.75] sm:text-lg">
            {creator.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <span className="inline-flex h-[46px] items-center rounded-full bg-white px-6 text-lg text-ink">
              <span className="mr-1.5 text-brand">{creator.products}</span> {creator.products === 1 ? "Product" : "Products"}
            </span>
            <FollowButton slug={slug} loggedIn={!!session} initialFollowing={following} initialFollowers={creator.followers} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-page px-5 pb-20 pt-10 md:pt-14">
        <form action={`/creators/${slug}`} method="get" className="flex flex-wrap items-center gap-3">
          <AutoSubmitSelect
            name="level"
            label="Level"
            value={level}
            options={[{ value: "", label: "All levels" }, ...["Beginner", "Intermediate", "Advanced"].map((l) => ({ value: l, label: l }))]}
          />
          <AutoSubmitSelect
            name="category"
            label="Category"
            value={category}
            options={[{ value: "", label: "All" }, ...ALL_CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))]}
          />
          <div className="sm:ml-auto">
            <AutoSubmitSelect name="sort" label="Sort by" value={sort} options={SORT_KEYS.map((k) => ({ value: k, label: SORT_LABELS[k] }))} />
          </div>
          <noscript>
            <button type="submit" className="rounded-full border border-line px-5 py-2">
              Apply
            </button>
          </noscript>
        </form>

        <div className="mt-8">{courses.length ? <CourseGrid courses={courses} /> : <EmptyState />}</div>

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-3">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="inline-flex h-11 items-center rounded-full border border-line px-5 hover:border-ink">
                Previous
              </Link>
            )}
            <span className="px-3 text-mute">
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Link href={pageHref(page + 1)} className="inline-flex h-11 items-center rounded-full bg-lime px-5 hover:bg-lime-dark">
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
