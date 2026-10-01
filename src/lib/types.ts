export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface CourseDTO {
  slug: string;
  title: string;
  creator: string;
  creatorSlug: string;
  categories: string[];
  image: string;
  lessons: number;
  duration: string;
  comments: number;
  rating: number;
  level: Level;
  price: number;
  enrolled: number;
}

export interface TestimonialDTO {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "creator";
}

export type SortKey = "relevant" | "newest" | "rating" | "price-asc" | "price-desc";

export interface ModuleDTO {
  title: string;
  summary: string;
  minutes: number;
}

/** Everything the course pages need (card data + long-form content). */
export interface CourseDetailDTO extends CourseDTO {
  headline: string;
  subtitle: string;
  description: string[];
  keyPoints: string[];
  modules: ModuleDTO[];
  gallery: string[];
  hero: string;
  students: number;
  reviewCount: number;
}

export interface CreatorDTO {
  slug: string;
  name: string;
  headline: string;
  bio: string[];
  avatar: string;
  followers: number;
  products: number;
}

export interface ReviewDTO {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  when: string;
  comment: string;
}
