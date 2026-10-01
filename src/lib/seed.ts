import { connectDB } from "./db";
import { Course } from "@/models/Course";
import { Testimonial } from "@/models/Testimonial";
import { SEED_COURSES, SEED_TESTIMONIALS } from "./seed-data";

/** Inserts starter data. Only touches empty collections unless `force` is set. */
export async function seedDatabase({ force = false } = {}) {
  await connectDB();
  const result = { courses: 0, testimonials: 0 };

  if (force) await Promise.all([Course.deleteMany({}), Testimonial.deleteMany({})]);

  if ((await Course.estimatedDocumentCount()) === 0) {
    await Course.insertMany(SEED_COURSES.map((c, order) => ({ ...c, order })), { ordered: false });
    result.courses = SEED_COURSES.length;
  }
  if ((await Testimonial.estimatedDocumentCount()) === 0) {
    await Testimonial.insertMany(SEED_TESTIMONIALS.map((t, order) => ({ ...t, order })));
    result.testimonials = SEED_TESTIMONIALS.length;
  }
  return result;
}

let seeding: Promise<unknown> | null = null;
let seeded = false;

/** Lazy first-run seeding so a fresh database is usable without running a script. */
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
