import Image from "next/image";
import { CourseCard } from "@/components/course/CourseCard";
import { LearningProgressCard } from "@/components/course/FloatCards";
import { Shape } from "@/components/ui/Shape";
import { SEED_COURSES } from "@/lib/seed-data";

const STATS = [
  { value: "12K", label: "Students" },
  { value: "70+", label: "Courses" },
  { value: "16", label: "Creators" },
];

export function Growth() {
  return (
    <section id="growth" className="px-5 pb-16 pt-16 md:pb-[100px] md:pt-[110px]">
      <div className="mx-auto grid max-w-page items-center gap-14 lg:grid-cols-[1fr_580px]">
        <div>
          <h2 className="text-[34px] font-semibold leading-[1.2] md:text-[44px]">
            Your Path to Professional
            <br className="hidden md:block" /> Growth Starts Here!
          </h2>
          <p className="mt-9 max-w-[560px] text-lg leading-[1.6] text-[#4b4c53]">
            Explore our curated selection of courses tailored to enhance your capabilities and accelerate your career
            journey. Whether you are looking to sharpen specific skills, gain industry expertise, or embark on a new
            career path entirely, we have the resources you need.
          </p>
          <dl className="mt-10 flex gap-12">
            {STATS.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-4xl font-medium leading-none text-brand">{s.value}</dd>
                <dt className="mt-2 text-lg text-[#4b4c53]">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto h-[440px] w-full max-w-[600px] sm:h-[520px] lg:h-[570px]" aria-hidden="true">
          <CourseCard course={SEED_COURSES[0]} className="absolute left-0 top-3 hidden w-[373px] shadow-float lg:block" />
          <Image
            src="/images/photos/hero-student.webp"
            alt=""
            width={516}
            height={483}
            className="absolute right-0 top-0 h-auto w-[92%] max-w-[516px] drop-shadow-[0_40px_40px_rgba(4,8,25,0.28)] lg:right-[-20px]"
          />
          <Shape name="spring-b" tone="lime" className="right-[2%] top-[14%] w-[24%] max-w-[140px] rotate-[8deg]" />
          <LearningProgressCard className="absolute bottom-6 right-0 w-[240px] lg:bottom-auto lg:right-[-16px] lg:top-[223px] lg:w-[232px]" />
        </div>
      </div>
    </section>
  );
}
