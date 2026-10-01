import { ButtonLink } from "@/components/ui/Button";
import { Shape } from "@/components/ui/Shape";
import { u } from "@/lib/utils";

export function CreatorBanner() {
  return (
    <section className="bg-grid overflow-hidden text-white">
      <div className="stage relative mx-auto max-w-[1440px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="absolute inset-y-0" style={{ width: u(1440), left: `calc(50% - ${u(720)})` }}>
            <Shape name="spring-a" tone="lime" style={{ left: u(-46), top: u(-40), width: u(230), transform: "rotate(-62deg)" }} />
            <Shape name="spring-c" tone="white" style={{ left: u(208), top: u(28), width: u(120), transform: "rotate(10deg)" }} />
            <Shape name="cone" tone="white" style={{ left: u(-30), top: u(238), width: u(150), transform: "rotate(-30deg)" }} />
            <Shape name="torus" tone="lime" style={{ left: u(66), top: u(368), width: u(250), transform: "rotate(-10deg)" }} />
            <Shape name="pyramid" tone="lime" style={{ left: u(1100), top: u(16), width: u(140), transform: "rotate(4deg)" }} />
            <Shape name="cylinder" tone="white" style={{ left: u(1236), top: u(40), width: u(270), transform: "rotate(-10deg)" }} />
            <Shape name="spring-b" tone="lime" style={{ left: u(1170), top: u(330), width: u(210), transform: "rotate(-20deg)" }} />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[960px] px-5 py-16 text-center md:py-[83px]">
          <h2 className="mx-auto max-w-[620px] text-[32px] font-medium leading-[1.2] md:text-[44px]">
            Unlock Your Potential as a Creator with ByteSpace
          </h2>
          <p className="mx-auto mt-8 max-w-[900px] text-base font-light leading-[1.6] text-white/95 md:text-[17px]">
            Experience the collaboration of numerous creators and an expanding selection of courses. Register now and
            become a part of a community comprising over 10,000 local and international creators. Utilize our Course
            Editor, and showcase your expertise by publishing your finest course on the ByteSpace Course Library.
          </p>
          <ButtonLink href="/signup" size="lg" className="on-blue mt-10">
            Join as Creator
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
