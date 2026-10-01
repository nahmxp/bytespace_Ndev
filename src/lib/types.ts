export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface CourseDTO {
  slug: string;
  title: string;
  creator: string;
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
