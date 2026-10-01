import { connectDB } from "./db";
import { isDbConfigured } from "./env";
import { ensureSeeded } from "./seed";
import { SEED_COURSES, SEED_CREATORS, SEED_TESTIMONIALS } from "./seed-data";
import { SEED_COURSE_DETAILS, buildDetail } from "./course-content";
import { escapeRegex } from "./utils";
import { Course } from "@/models/Course";
import { Testimonial } from "@/models/Testimonial";
import { Creator } from "@/models/Creator";
import { Follow } from "@/models/Follow";
import type { CourseDTO, CourseDetailDTO, CreatorDTO, Level, SortKey, TestimonialDTO } from "./types";

export interface CourseQuery {
  category?: string;
  creator?: string;
  q?: string;
  level?: string;
  sort?: SortKey;
  page?: number;
  limit?: number;
}

export interface CourseResult {
  courses: CourseDTO[];
  total: number;
  page: number;
  pages: number;
  source: "db" | "static";
}

const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];
export const SORT_KEYS: SortKey[] = ["relevant", "newest", "rating", "price-asc", "price-desc"];

function normalise(query: CourseQuery) {
  const limit = Math.min(Math.max(Math.trunc(query.limit ?? 9), 1), 48);
  const page = Math.max(Math.trunc(query.page ?? 1), 1);
  const level = LEVELS.find((l) => l.toLowerCase() === (query.level ?? "").toLowerCase());
  const sort: SortKey = SORT_KEYS.includes(query.sort as SortKey) ? (query.sort as SortKey) : "relevant";
  return {
    limit,
    page,
    level,
    sort,
    category: query.category?.trim().toLowerCase() || undefined,
    creator: query.creator?.trim().toLowerCase() || undefined,
    q: query.q?.trim().slice(0, 80) || undefined,
  };
}

function queryStatic(query: CourseQuery): CourseResult {
  const { limit, page, level, sort, category, creator, q } = normalise(query);
  let list = SEED_COURSES.filter((c) => {
    if (category && !c.categories.includes(category)) return false;
    if (creator && c.creatorSlug !== creator) return false;
    if (level && c.level !== level) return false;
    if (q) {
      const hay = `${c.title} ${c.creator}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
  const sorters: Record<SortKey, ((a: CourseDTO, b: CourseDTO) => number) | null> = {
    relevant: null,
    newest: (a, b) => SEED_COURSES.indexOf(b) - SEED_COURSES.indexOf(a),
    rating: (a, b) => b.rating - a.rating,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };
  const fn = sorters[sort];
  if (fn) list = [...list].sort(fn);
  const total = list.length;
  return {
    courses: list.slice((page - 1) * limit, page * limit),
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    source: "static",
  };
}

const SORT_MAP: Record<SortKey, Record<string, 1 | -1>> = {
  relevant: { order: 1 },
  newest: { createdAt: -1, order: 1 },
  rating: { rating: -1, enrolled: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
};

type CourseLike = {
  slug: string;
  title: string;
  creator: string;
  creatorSlug?: string | null;
  categories: string[];
  image: string;
  lessons: number;
  duration: string;
  comments: number;
  rating: number;
  level: string;
  price: number;
  enrolled: number;
};

function toCourseDTO(d: CourseLike): CourseDTO {
  return {
    slug: d.slug,
    title: d.title,
    creator: d.creator,
    creatorSlug: d.creatorSlug || SEED_COURSES.find((c) => c.slug === d.slug)?.creatorSlug || "purepearl-studio",
    categories: d.categories,
    image: d.image,
    lessons: d.lessons,
    duration: d.duration,
    comments: d.comments,
    rating: d.rating,
    level: d.level as Level,
    price: d.price,
    enrolled: d.enrolled,
  };
}

export async function getCourses(query: CourseQuery = {}): Promise<CourseResult> {
  if (!isDbConfigured()) return queryStatic(query);

  try {
    await connectDB();
    await ensureSeeded();
    const { limit, page, level, sort, category, creator, q } = normalise(query);

    const filter: Record<string, unknown> = {};
    if (category) filter.categories = category;
    if (creator) filter.creatorSlug = creator;
    if (level) filter.level = level;
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: rx }, { creator: rx }];
    }

    const [docs, total] = await Promise.all([
      Course.find(filter)
        .sort(SORT_MAP[sort])
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter),
    ]);

    const courses: CourseDTO[] = docs.map(toCourseDTO);
    return { courses, total, page, pages: Math.max(Math.ceil(total / limit), 1), source: "db" };
  } catch (err) {
    console.error("[courses] database unavailable, serving static catalogue:", err);
    return queryStatic(query);
  }
}

export async function getTestimonials(): Promise<TestimonialDTO[]> {
  if (!isDbConfigured()) return SEED_TESTIMONIALS;
  try {
    await connectDB();
    await ensureSeeded();
    const docs = await Testimonial.find().sort({ order: 1 }).limit(6).lean();
    if (!docs.length) return SEED_TESTIMONIALS;
    return docs.map((d) => ({ name: d.name, role: d.role, quote: d.quote, avatar: d.avatar }));
  } catch (err) {
    console.error("[testimonials] database unavailable, serving static data:", err);
    return SEED_TESTIMONIALS;
  }
}

/** Full course content for the detail / lessons / reviews pages. Returns null if it doesn't exist. */
export async function getCourseDetail(slug: string): Promise<CourseDetailDTO | null> {
  const fallback = SEED_COURSE_DETAILS.find((c) => c.slug === slug) ?? null;
  if (!isDbConfigured()) return fallback;

  try {
    await connectDB();
    await ensureSeeded();
    const d = await Course.findOne({ slug }).lean();
    if (!d) return null;
    const base = toCourseDTO(d);
    const gen = buildDetail(base); // fills in anything missing on documents created by hand
    return {
      ...base,
      headline: d.headline || gen.headline,
      subtitle: d.subtitle || gen.subtitle,
      description: d.description?.length ? d.description : gen.description,
      keyPoints: d.keyPoints?.length ? d.keyPoints : gen.keyPoints,
      modules: d.modules?.length ? d.modules.map((m) => ({ title: m.title ?? "", summary: m.summary ?? "", minutes: m.minutes ?? 0 })) : gen.modules,
      gallery: d.gallery?.length ? d.gallery : gen.gallery,
      hero: d.hero || gen.hero,
      students: d.students || gen.students,
      reviewCount: d.reviewCount || gen.reviewCount,
    };
  } catch (err) {
    console.error("[course] database unavailable, serving static content:", err);
    return fallback;
  }
}

function staticCreators(): CreatorDTO[] {
  return SEED_CREATORS.map((c) => ({ ...c, products: SEED_COURSES.filter((x) => x.creatorSlug === c.slug).length }));
}

export async function getCreators(): Promise<CreatorDTO[]> {
  if (!isDbConfigured()) return staticCreators();
  try {
    await connectDB();
    await ensureSeeded();
    const docs = await Creator.find().sort({ followers: -1, name: 1 }).lean();
    return await Promise.all(
      docs.map(async (c) => ({
        slug: c.slug,
        name: c.name,
        headline: c.headline ?? "",
        bio: c.bio ?? [],
        avatar: c.avatar,
        followers: c.followers + (await Follow.countDocuments({ creatorSlug: c.slug })),
        products: await Course.countDocuments({ creatorSlug: c.slug }),
      })),
    );
  } catch (err) {
    console.error("[creators] database unavailable, serving static data:", err);
    return staticCreators();
  }
}

export async function getCreator(slug: string): Promise<CreatorDTO | null> {
  return (await getCreators()).find((c) => c.slug === slug) ?? null;
}
