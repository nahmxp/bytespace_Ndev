import type { ReviewDTO } from "./types";

const av = (n: number) => `/images/avatars/a${n}.webp`;

/** Sample reviews shown on every course (the catalogue ships without user-written reviews). */
export const SAMPLE_REVIEWS: ReviewDTO[] = [
  { id: "r1", name: "PurePearl Studio", role: "UI/UX Designer", avatar: av(12), rating: 5, when: "a year ago", comment: "\"The course provided me with a comprehensive understanding of digital asset creation. The lessons were in-depth, practical, and immediately applicable to my work. Highly recommended!\"" },
  { id: "r2", name: "Albert Flores", role: "UI/UX Designer", avatar: av(5), rating: 5, when: "a year ago", comment: "This course transformed my approach to digital design. The combination of theory, hands-on exercises, and real-world applications made it a truly enriching experience. Excited to implement what I've learned!" },
  { id: "r3", name: "Cody Fisher", role: "UI/UX Designer", avatar: av(7), rating: 5, when: "a year ago", comment: "Clear structure, friendly pacing and great downloadable resources. I finished the capstone project and it's now the centrepiece of my portfolio." },
  { id: "r4", name: "Marvin McKinney", role: "Product Designer", avatar: av(4), rating: 4, when: "2 years ago", comment: "Really solid content. I'd have loved a few more advanced examples toward the end, but the fundamentals are explained better than anywhere else I've looked." },
  { id: "r5", name: "Jenny Wilson", role: "Freelance Illustrator", avatar: av(10), rating: 5, when: "2 years ago", comment: "Short lessons that respect your time. I picked up a new workflow in the first week and landed a client with the skills from module five." },
  { id: "r6", name: "Kristin Watson", role: "Marketing Lead", avatar: av(2), rating: 4, when: "2 years ago", comment: "Great for getting my whole team on the same page about the basics. The peer critique module was especially useful." },
  { id: "r7", name: "Devon Lane", role: "Web Developer", avatar: av(6), rating: 4, when: "2 years ago", comment: "Practical and well paced. Some sections moved fast for me, but rewatching the lessons solved that." },
  { id: "r8", name: "Courtney Henry", role: "Student", avatar: av(14), rating: 3, when: "3 years ago", comment: "Good overview, though I wanted more depth on platform-specific optimisation. Still worth it at this price." },
  { id: "r9", name: "Darrell Steward", role: "Photographer", avatar: av(3), rating: 5, when: "3 years ago", comment: "Exactly what I needed to organise and present my work digitally. The management best-practices module alone paid for the course." },
  { id: "r10", name: "Theresa Webb", role: "Art Director", avatar: av(9), rating: 2, when: "3 years ago", comment: "Content was fine but not the level I expected. Support was quick to respond to my questions though." },
];

const WEIGHTS = [0.71, 0.17, 0.06, 0.03, 0.03]; // 5★ → 1★, averages ≈ 4.5

/** Rating distribution [5★, 4★, 3★, 2★, 1★] summing to `total`. */
export function ratingDistribution(total: number): number[] {
  const counts = WEIGHTS.map((w) => Math.round(total * w));
  counts[0] += total - counts.reduce((a, b) => a + b, 0);
  return counts;
}

export function filterReviews(rating?: number) {
  return rating ? SAMPLE_REVIEWS.filter((r) => r.rating === rating) : SAMPLE_REVIEWS;
}
