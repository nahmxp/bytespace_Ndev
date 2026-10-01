import type { CourseDTO, CreatorDTO, TestimonialDTO } from "./types";

const img = (n: string) => `/images/courses/${n}.webp`;
const STUDIO = "purepearl studio";
const STUDIO_SLUG = "purepearl-studio";

type Seed = Omit<CourseDTO, "creator" | "creatorSlug" | "lessons" | "duration" | "comments" | "rating" | "enrolled" | "level" | "price"> &
  Partial<Pick<CourseDTO, "creator" | "creatorSlug" | "lessons" | "duration" | "comments" | "rating" | "enrolled" | "level" | "price">>;

const base = (c: Seed): CourseDTO => ({
  creator: STUDIO,
  creatorSlug: STUDIO_SLUG,
  lessons: 17,
  duration: "2 hours 16 mins",
  comments: 59,
  rating: 4.5,
  enrolled: 26,
  level: "Beginner",
  price: 25,
  ...c,
});

/** Static course catalogue: used to seed MongoDB and as a fallback when no DB is configured. */
export const SEED_COURSES: CourseDTO[] = [
  base({ slug: "learn-figma-from-basic", title: "Learn Figma from Basic", image: img("figma"), categories: ["featured", "ui-ux-design", "design"] }),
  base({ slug: "build-digital-asset", title: "Build Digital Asset", image: img("icons"), categories: ["featured", "graphic-design", "digital-illustration", "design"] }),
  base({ slug: "the-power-of-big-data", title: "the Power of Big Data", image: img("bigdata"), categories: ["featured", "data-science", "it-software"] }),
  base({ slug: "balancing-productivity-and-life", title: "Balancing Productivity and Life", image: img("desk"), categories: ["featured", "productivity", "business"] }),
  base({ slug: "mastering-money-management", title: "Mastering Money Management", image: img("finance"), categories: ["featured", "finance", "business"] }),
  base({ slug: "from-idea-to-startup-success", title: "From Idea to Startup Success", image: img("team"), categories: ["featured", "freelance-entrepreneurship", "business"] }),
  base({ slug: "wireframing-for-beginners", title: "Wireframing for Beginners", image: img("wireframe"), categories: ["ui-ux-design", "design"], lessons: 12, duration: "1 hour 48 mins", comments: 31, rating: 4.7, enrolled: 41 }),
  base({ slug: "design-systems-in-figma", creator: "Pixel & Pine", creatorSlug: "pixel-and-pine", title: "Design Systems in Figma", image: img("uikit"), categories: ["ui-ux-design", "design", "web-development"], level: "Intermediate", lessons: 24, duration: "4 hours 5 mins", comments: 44, rating: 4.8, enrolled: 63, price: 39 }),
  base({ slug: "mobile-app-design-sprint", creator: "Pixel & Pine", creatorSlug: "pixel-and-pine", title: "Mobile App Design Sprint", image: img("apps"), categories: ["ui-ux-design", "development", "design"], level: "Intermediate", lessons: 20, duration: "3 hours 30 mins", comments: 27, rating: 4.6, enrolled: 35, price: 35 }),
  base({ slug: "modern-web-development", creator: "Northwind Academy", creatorSlug: "northwind-academy", title: "Modern Web Development", image: img("workspace"), categories: ["web-development", "development", "it-software"], level: "Intermediate", lessons: 38, duration: "8 hours 12 mins", comments: 112, rating: 4.9, enrolled: 240, price: 49 }),
  base({ slug: "social-media-marketing-playbook", creator: "Lumen Creative", creatorSlug: "lumen-creative", title: "Social Media Marketing Playbook", image: img("apps"), categories: ["marketing", "social-media", "creative-marketing"], lessons: 15, duration: "2 hours 40 mins", comments: 48, rating: 4.4, enrolled: 88 }),
  base({ slug: "brand-identity-essentials", title: "Brand Identity Essentials", image: img("icons"), categories: ["graphic-design", "creative-marketing", "design"], level: "Intermediate", lessons: 18, duration: "3 hours 10 mins", comments: 36, rating: 4.6, enrolled: 52, price: 29 }),
  base({ slug: "freelancing-from-zero", creator: "Lumen Creative", creatorSlug: "lumen-creative", title: "Freelancing from Zero", image: img("desk"), categories: ["freelance-entrepreneurship", "business", "productivity"], lessons: 14, duration: "2 hours 5 mins", comments: 22, rating: 4.3, enrolled: 74 }),
  base({ slug: "photography-basics", creator: "Lumen Creative", creatorSlug: "lumen-creative", title: "Photography Basics", image: img("workspace"), categories: ["photography", "film-video"], lessons: 16, duration: "2 hours 55 mins", comments: 39, rating: 4.5, enrolled: 96, price: 22 }),
  base({ slug: "data-storytelling", creator: "Northwind Academy", creatorSlug: "northwind-academy", title: "Data Storytelling with Charts", image: img("finance"), categories: ["data-science", "it-software"], level: "Advanced", lessons: 22, duration: "3 hours 45 mins", comments: 19, rating: 4.7, enrolled: 29, price: 45 }),
  base({ slug: "startup-team-workshops", creator: "Lumen Creative", creatorSlug: "lumen-creative", title: "Startup Team Workshops", image: img("team"), categories: ["business", "productivity"], level: "Intermediate", lessons: 10, duration: "1 hour 30 mins", comments: 14, rating: 4.2, enrolled: 18, price: 19 }),
];

const av = (n: number) => `/images/avatars/a${n}.webp`;

export const SEED_TESTIMONIALS: TestimonialDTO[] = [
  {
    name: "Sarah M.",
    role: "Enthusiastic Learner",
    quote:
      "ByteSpace has transformed my approach to learning. The diverse range of courses and the quality of content provided by creators have exceeded my expectations. The platform truly fosters a sense of community and lifelong learning.",
    avatar: av(10),
  },
  {
    name: "James L.",
    role: "Lifelong Learner",
    quote:
      "I've tried several online learning platforms, and ByteSpace stands out for its vibrant community and the variety of courses available. The easy navigation and engaging content make it a go-to platform for continuous skill development.",
    avatar: av(7),
  },
  {
    name: "Alex B.",
    role: "Inspired Creator",
    quote:
      "As a creator, ByteSpace has been a game-changer for me. The Course Editor is user-friendly, and the support from the community is incredible. It's fulfilling to see my courses making a positive impact on learners globally.",
    avatar: av(4),
  },
];

const av2 = (n: number) => `/images/avatars/a${n}.webp`;

/** Baseline creator profiles. `products` is computed from the catalogue at read time. */
export const SEED_CREATORS: Omit<CreatorDTO, "products">[] = [
  {
    slug: STUDIO_SLUG,
    name: "PurePearl Studio",
    headline: "Passionate UI/UX, Web designer",
    bio: [
      "Welcome to the creative world of PurePearl Studio. Here, you'll discover the passion, expertise, and inspiration that drive my creative journey. Let's explore and learn together!",
      "Dive into my creative portfolio, showcasing a glimpse of my artistic endeavors. From digital designs to multimedia projects, each piece tells a unique story. Explore the world of creativity with me.",
    ],
    avatar: av2(1),
    followers: 12,
  },
  {
    slug: "pixel-and-pine",
    name: "Pixel & Pine",
    headline: "Product designer and design systems nerd",
    bio: [
      "Pixel & Pine is a small studio teaching practical product design: from messy first sketches to scalable design systems used by real teams.",
      "Expect short, honest lessons, real project files, and plenty of critique along the way.",
    ],
    avatar: av2(11),
    followers: 48,
  },
  {
    slug: "northwind-academy",
    name: "Northwind Academy",
    headline: "Engineers teaching modern web and data skills",
    bio: [
      "Northwind Academy is a group of working engineers who turn what they ship at work into clear, project-based courses.",
      "From your first component to production-ready apps and data stories, we teach the parts tutorials skip.",
    ],
    avatar: av2(13),
    followers: 131,
  },
  {
    slug: "lumen-creative",
    name: "Lumen Creative",
    headline: "Marketing, photography and freelance coach",
    bio: [
      "Lumen Creative helps makers and small teams find an audience, tell better stories, and get paid for their craft.",
      "Our courses mix marketing playbooks, photography fundamentals and the business side of freelancing.",
    ],
    avatar: av2(8),
    followers: 77,
  },
];
