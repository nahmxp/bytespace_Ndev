import Image from "next/image";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Shape } from "@/components/ui/Shape";
import { Button } from "@/components/ui/Button";
import { CategoryStatCard, HappyStudentsCard, LearningProgressCard } from "@/components/course/FloatCards";
import { u } from "@/lib/utils";

/** All coordinates below are design pixels on the 1440px Figma canvas; stage origin is y=500. */
export function Hero() {
  return (
    <section className="bg-grid overflow-hidden text-white">
      <div className="stage relative mx-auto max-w-[1440px]">
        <Navbar />

        <div className="relative z-10 px-5 text-center" style={{ paddingTop: u(52) }}>
          <h1
            className="mx-auto font-semibold leading-[1.16]"
            style={{ fontSize: u(72), maxWidth: u(920) }}
          >
            Get Access to Hundreds Courses Available
          </h1>
          <p
            className="mx-auto max-w-[900px] font-light text-white/90"
            style={{ marginTop: u(30), fontSize: `max(15px, ${u(18)})` }}
          >
            Unlock your creativity, gain valuable knowledge, and grow your business with our wide range of courses.
          </p>

          <form
            action="/courses"
            method="get"
            role="search"
            className="mx-auto flex max-w-[580px] items-center gap-3"
            style={{ marginTop: u(34) }}
          >
            <label htmlFor="hero-search" className="sr-only">
              Search courses, topics or creators
            </label>
            <div className="relative min-w-0 flex-1">
              <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/60" aria-hidden />
              <input
                id="hero-search"
                name="q"
                type="search"
                maxLength={80}
                placeholder="Course, topic, creator"
                className="h-[52px] w-full rounded-full bg-white pl-12 pr-4 text-base text-ink placeholder:text-ink/45 focus:outline-none focus-visible:ring-4 focus-visible:ring-lime/60"
              />
            </div>
            <Button type="submit" size="lg" className="on-blue">
              Search
            </Button>
          </form>
        </div>

        {/* Artwork */}
        <div className="relative" style={{ height: u(523), marginTop: u(12) }} aria-hidden="true">
          <div className="absolute inset-y-0" style={{ width: u(1440), left: `calc(50% - ${u(720)})` }}>
            <div className="absolute rounded-full bg-lime" style={{ left: u(162), top: u(84), width: u(1115), height: u(1115) }} />

            <Shape name="spring-b" tone="lime" priority style={{ left: u(-40), top: u(-232), width: u(255), transform: "rotate(-16deg)" }} />
            <Shape name="spring-c" tone="white" style={{ left: u(214), top: u(-2), width: u(122), transform: "rotate(8deg)" }} />
            <Shape name="torus" tone="white" style={{ left: u(60), top: u(236), width: u(250), transform: "rotate(-14deg)" }} />
            <Shape name="cylinder" tone="lime" style={{ left: u(1222), top: u(-262), width: u(300), transform: "rotate(-4deg)" }} />
            <Shape name="pyramid" tone="white" style={{ left: u(1128), top: u(-20), width: u(150), transform: "rotate(-6deg)" }} />
            <Shape name="spring-a" tone="white" style={{ left: u(1176), top: u(196), width: u(230), transform: "rotate(-12deg)" }} />

            <Image
              src="/images/photos/hero-student.webp"
              alt=""
              width={516}
              height={483}
              priority
              className="pointer-events-none absolute h-auto max-w-none"
              style={{ left: u(503), top: u(53), width: u(510) }}
            />

            <div className="hidden md:block">
              <CategoryStatCard className="absolute" style={{ left: u(405), top: u(139), width: u(207) }} />
              <LearningProgressCard className="absolute" style={{ left: u(841), top: u(151), width: u(232) }} />
              <HappyStudentsCard className="absolute" style={{ left: u(328), top: u(337), width: u(258) }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
