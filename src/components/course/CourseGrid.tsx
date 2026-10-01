import { CourseCard } from "./CourseCard";
import type { CourseDTO } from "@/lib/types";

export function CourseGrid({ courses }: { courses: CourseDTO[] }) {
  return (
    <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c, i) => (
        <li key={c.slug} className="min-w-0">
          <CourseCard course={c} priority={i < 3} />
        </li>
      ))}
    </ul>
  );
}
