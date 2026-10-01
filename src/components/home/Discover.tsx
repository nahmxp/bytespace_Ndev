import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseExplorer } from "./CourseExplorer";
import type { CourseDTO } from "@/lib/types";

export function Discover({ courses, total }: { courses: CourseDTO[]; total: number }) {
  return (
    <section id="courses" className="bg-white px-5 pb-16 pt-14 md:pb-[72px] md:pt-[72px]">
      <SectionHeading
        title={
          <>
            Discover Your Passion,
            <br />
            Build Your Skills
          </>
        }
        description="At Bytespace Courses, we bring you closer to life-changing knowledge. Explore a variety of courses across different fields, from technology to the arts, and make a difference in your career and life."
      />
      <div className="mt-10 md:mt-11">
        <CourseExplorer initialCourses={courses} initialTotal={total} />
      </div>
    </section>
  );
}
