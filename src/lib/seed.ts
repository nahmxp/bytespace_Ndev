import { connectDB } from "./db";
import { Course } from "@/models/Course";
import { Creator } from "@/models/Creator";
import { Testimonial } from "@/models/Testimonial";
import { Meta } from "@/models/Meta";
import { SEED_COURSE_DETAILS } from "./course-content";
import { SEED_CREATORS, SEED_TESTIMONIALS } from "./seed-data";

/** Bump when seed data changes shape so existing databases are upgraded automatically. */
export const SEED_VERSION = 2;

/**
 * Upserts the starter catalogue (matched by slug, so re-running never duplicates).
 * Skips work when the database is already at SEED_VERSION unless `force` is set.
 * `force` wipes catalogue collections first (users, enrollments and follows are never touched).
 */
export async function seedDatabase({ force = false } = {}) {
  await connectDB();
  const result = { courses: 0, creators: 0, testimonials: 0 };

  if (force) {
    await Promise.all([Course.deleteMany({}), Creator.deleteMany({}), Testimonial.deleteMany({}), Meta.deleteMany({ key: "seedVersion" })]);
  }

  const current = Number((await Meta.findOne({ key: "seedVersion" }).lean())?.value ?? 0);
  if (current >= SEED_VERSION) return result;

  const courseOps = SEED_COURSE_DETAILS.map((c, order) => ({
    updateOne: { filter: { slug: c.slug }, update: { $set: { ...c, order } }, upsert: true },
  }));
  await Course.bulkWrite(courseOps as unknown as Parameters<typeof Course.bulkWrite>[0]);
  result.courses = SEED_COURSE_DETAILS.length;

  await Creator.bulkWrite(
    SEED_CREATORS.map((c) => ({ updateOne: { filter: { slug: c.slug }, update: { $set: c }, upsert: true } })),
  );
  result.creators = SEED_CREATORS.length;

  if ((await Testimonial.estimatedDocumentCount()) === 0) {
    await Testimonial.insertMany(SEED_TESTIMONIALS.map((t, order) => ({ ...t, order })));
    result.testimonials = SEED_TESTIMONIALS.length;
  }

  await Meta.updateOne({ key: "seedVersion" }, { $set: { value: SEED_VERSION } }, { upsert: true });
  return result;
}

let seeding: Promise<unknown> | null = null;
let seeded = false;

/** Lazy, once-per-process seeding so a fresh (or older) database is usable without running a script. */
export async function ensureSeeded() {
  if (seeded) return;
  seeding ??= seedDatabase()
    .then(() => {
      seeded = true;
    })
    .finally(() => {
      seeding = null;
    });
  await seeding;
}
