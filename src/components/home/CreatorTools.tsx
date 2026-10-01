import Image from "next/image";
import { RevenueCard, YearToDateCard, HappyStudentsCard } from "@/components/course/FloatCards";
import { Shape } from "@/components/ui/Shape";

const POINTS = ["Share Your Expertise", "Monetize Your Passion", "Flexibility and Autonomy", "Build a Community"];

function Check() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
      <circle cx="11" cy="11" r="11" fill="#003BE2" />
      <path d="M6.2 11.3l3.3 3.2 6.3-6.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CreatorTools() {
  return (
    <section id="creators" className="px-5 pb-16 md:pb-[119px]">
      <div className="mx-auto grid max-w-page items-center gap-14 lg:grid-cols-[600px_1fr]">
        <div className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[520px] lg:h-[560px] lg:max-w-none" aria-hidden="true">
          <RevenueCard className="absolute left-0 top-2 w-[240px]" />
          <YearToDateCard className="absolute left-0 top-[150px] w-[134px]" />
          <Image
            src="/images/photos/creator-woman.webp"
            alt=""
            width={500}
            height={500}
            className="absolute left-[10%] top-0 h-auto w-[78%] max-w-[500px] drop-shadow-[0_30px_35px_rgba(4,8,25,0.22)] lg:left-[-77px] lg:top-[-33px] lg:w-[625px] lg:max-w-none"
          />
          <Shape name="spring-a" tone="lime" className="right-[10%] top-[26%] w-[22%] max-w-[130px] rotate-[12deg] lg:right-auto lg:left-[338px]" />
          <HappyStudentsCard className="absolute bottom-0 right-0 w-[258px] lg:bottom-auto lg:left-[285px] lg:right-auto lg:top-[378px]" />
        </div>

        <div className="lg:pl-6">
          <h2 className="text-[34px] font-semibold leading-[1.2] md:text-[44px]">
            Create &amp; Manage
            <br className="hidden md:block" /> Courses Easily.
          </h2>
          <p className="mt-9 max-w-[520px] text-lg leading-[1.6] text-[#4b4c53]">
            <strong className="font-medium text-ink">ByteSpace</strong> supports individuals or entities in the
            creation, publication, and administration of educational courses.
          </p>
          <ul className="mt-9 space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-lg">
                <Check />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
