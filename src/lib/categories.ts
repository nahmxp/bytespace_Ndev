export interface Category {
  slug: string;
  label: string;
}

/** Filter pills shown on the landing page and the courses page. */
export const PRIMARY_CATEGORIES: Category[] = [
  { slug: "featured", label: "Featured" },
  { slug: "music", label: "Music" },
  { slug: "drawing-painting", label: "Drawing & Painting" },
  { slug: "marketing", label: "Marketing" },
  { slug: "animation", label: "Animation" },
  { slug: "social-media", label: "Social Media" },
  { slug: "ui-ux-design", label: "UI/UX Design" },
  { slug: "creative-marketing", label: "Creative Marketing" },
  { slug: "digital-illustration", label: "Digital Illustration" },
  { slug: "film-video", label: "Film & Video" },
  { slug: "crafts", label: "Crafts" },
  { slug: "freelance-entrepreneurship", label: "Freelance & Entrepreneurship" },
  { slug: "graphic-design", label: "Graphic Design" },
  { slug: "photography", label: "Photography" },
  { slug: "productivity", label: "Productivity" },
  { slug: "web-development", label: "Web Development" },
  { slug: "data-science", label: "Data Science" },
  { slug: "cooking", label: "Cooking" },
];

/** Revealed by the "+ More" pill. */
export const MORE_CATEGORIES: Category[] = [
  { slug: "business", label: "Business" },
  { slug: "it-software", label: "IT & Software" },
  { slug: "design", label: "Design" },
  { slug: "development", label: "Development" },
  { slug: "finance", label: "Finance" },
  { slug: "sport", label: "Sport" },
];

export const ALL_CATEGORIES: Category[] = [...PRIMARY_CATEGORIES, ...MORE_CATEGORIES];

export const LEARNING_PATHS: Category[] = [
  { slug: "design", label: "Design" },
  { slug: "development", label: "Development" },
  { slug: "it-software", label: "IT & Software" },
  { slug: "business", label: "Business" },
  { slug: "marketing", label: "Marketing" },
  { slug: "photography", label: "Photography" },
];

export function categoryLabel(slug: string) {
  return ALL_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function isCategory(slug: string) {
  return ALL_CATEGORIES.some((c) => c.slug === slug);
}
