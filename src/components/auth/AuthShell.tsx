import { Logo } from "@/components/ui/Logo";
import { Shape } from "@/components/ui/Shape";
import { CourseCard } from "@/components/course/CourseCard";
import { HappyStudentsCard } from "@/components/course/FloatCards";
import { SEED_COURSES } from "@/lib/seed-data";

const front = SEED_COURSES.find((c) => c.slug === "the-power-of-big-data")!;
const back = SEED_COURSES.find((c) => c.slug === "build-digital-asset")!;

function Artwork() {
  return (
    <div className="relative hidden h-[560px] w-[500px] xl:block" aria-hidden="true">
      <CourseCard course={back} countTone="black" className="absolute left-0 top-[88px] w-[373px] shadow-float" />
      <Shape name="torus" tone="lime" className="left-[46px] top-[30px] z-20 w-[128px] -rotate-12" />
      <CourseCard course={front} countTone="black" className="absolute left-[111px] top-0 z-10 w-[373px] shadow-float" />
      <Shape name="pyramid" tone="lime" className="left-[-6px] top-[410px] z-20 w-[140px]" />
      <HappyStudentsCard tone="lime" className="absolute left-[226px] top-[435px] z-30 w-[258px]" />
      <Shape name="spring-a" tone="white" className="left-[372px] top-[338px] z-40 w-[130px] rotate-[8deg]" />
    </div>
  );
}

/** Two-column auth layout on the blue grid: story + artwork on the left, form card on the right. */
export function AuthShell({
  heading,
  blurb,
  children,
}: {
  heading: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-grid on-blue min-h-screen text-white">
      <div className="mx-auto grid max-w-page gap-10 px-5 pb-16 pt-8 lg:min-h-screen lg:grid-cols-[1fr_578px] lg:items-start lg:gap-x-16 lg:py-[46px] xl:grid-cols-[500px_578px] xl:justify-between">
        <div>
          <Logo markOnly />
          <div className="mt-12 lg:mt-[44px]">
            <h2 className="font-display text-xl font-semibold">{heading}</h2>
            <p className="mt-3 max-w-[430px] text-lg font-light leading-[1.6] text-white/90">{blurb}</p>
          </div>
          <div className="mt-8 hidden xl:block">
            <Artwork />
          </div>
        </div>
        <div className="text-ink lg:mt-[74px]">{children}</div>
      </div>
    </main>
  );
}

export function AuthCard({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[560px] flex-col rounded-[32px] bg-white p-7 shadow-float sm:p-14 lg:min-h-[783px]">{children}</div>;
}

