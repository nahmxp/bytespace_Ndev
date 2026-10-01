import Image from "next/image";
import type { TestimonialDTO } from "@/lib/types";

export function Testimonials({ items }: { items: TestimonialDTO[] }) {
  return (
    <section id="testimonials" className="wash px-5 pb-16 pt-14 md:pb-16 md:pt-[75px]">
      <div className="mx-auto grid max-w-page items-center gap-6 md:grid-cols-2 md:gap-16">
        <h2 className="text-[34px] font-semibold leading-[1.2] md:text-[44px]">
          Discover What Our
          <br className="hidden md:block" /> Community Is Saying
        </h2>
        <p className="text-base leading-[1.7] text-mute md:text-[17px]">
          At ByteSpace, our vibrant community of learners and creators is at the heart of what we do. Hear directly from
          those who have experienced the transformative journey of learning and creating on our platform. Explore
          testimonials that reflect the diverse perspectives of enthusiastic learners and accomplished creators.
        </p>
      </div>

      <ul className="mx-auto mt-12 grid max-w-page items-start gap-10 md:mt-[71px] lg:grid-cols-3">
        {items.map((t) => (
          <li key={t.name}>
            <figure className="rounded-[28px] bg-white p-7 shadow-card">
              <Image src={t.avatar} alt="" width={160} height={160} className="h-20 w-20 rounded-full object-cover" />
              <figcaption className="mt-4">
                <span className="block font-display text-xl font-semibold">{t.name}</span>
                <span className="mt-0.5 block text-lg text-brand">{t.role}</span>
              </figcaption>
              <blockquote className="mt-4 text-lg leading-[1.55] text-[#5d6068]">&quot;{t.quote}&quot;</blockquote>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
