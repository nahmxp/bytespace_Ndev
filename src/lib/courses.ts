import { connectDB } from "./db";
import { isDbConfigured } from "./env";
import { ensureSeeded } from "./seed";
import { SEED_COURSES, SEED_TESTIMONIALS } from "./seed-data";
import { escapeRegex } from "./utils";
import { Course } from "@/models/Course";
import { Testimonial } from "@/models/Testimonial";
import type { CourseDTO, Level, SortKey, TestimonialDTO } from "./types";

export interface CourseQuery {
  category?: string;
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
    q: query.q?.trim().slice(0, 80) || undefined,
  };
}

function queryStatic(query: CourseQuery): CourseResult {
  const { limit, page, level, sort, category, q } = normalise(query);
  let list = SEED_COURSES.filter((c) => {
    if (category && !c.categories.includes(category)) return false;
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

export async function getCourses(query: CourseQuery = {}): Promise<CourseResult> {
  if (!isDbConfigured()) return queryStatic(query);

  try {
    await connectDB();
    await ensureSeeded();
    const { limit, page, level, sort, category, q } = normalise(query);

    const filter: Record<string, unknown> = {};
    if (category) filter.categories = category;
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

    const courses: CourseDTO[] = docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      creator: d.creator,
      categories: d.categories,
      image: d.image,
      lessons: d.lessons,
      duration: d.duration,
      comments: d.comments,
      rating: d.rating,
      level: d.level as Level,
      price: d.price,
      enrolled: d.enrolled,
    }));
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
