/**
 * Seeds MongoDB with starter courses and testimonials.
 *   npm run seed          # only fills empty collections
 *   npm run seed:force    # wipes courses + testimonials first
 */
import { existsSync } from "node:fs";

for (const f of [".env.local", ".env"]) {
  if (existsSync(f)) process.loadEnvFile(f);
}

async function main() {
  const { seedDatabase } = await import("../src/lib/seed");
  const mongoose = (await import("mongoose")).default;
  const force = process.argv.includes("--force");
  const res = await seedDatabase({ force });
  console.log(`Seed complete: ${res.courses} courses, ${res.testimonials} testimonials inserted.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
