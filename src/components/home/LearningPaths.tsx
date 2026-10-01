import Link from "next/link";
import { Building2, Camera, Code2, Laptop, Megaphone, PencilRuler } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LEARNING_PATHS } from "@/lib/categories";

const ICONS = {
  design: PencilRuler,
  development: Code2,
  "it-software": Laptop,
  business: Building2,
  marketing: Megaphone,
  photography: Camera,
} as const;

export function LearningPaths() {
  return (
    <section id="categories" className="bg-white px-5 pb-20 md:pb-[120px]">
      <SectionHeading
        size="md"
        title="Explore Diverse Learning Paths at Bytespace"
        description="At Bytespace, we believe in empowering individuals through knowledge. Our diverse range of courses spans various fields, ensuring there's something for everyone. Unleash your potential and explore our carefully curated categories."
      />
      <ul className="mx-auto mt-12 grid max-w-page grid-cols-2 gap-5 sm:grid-cols-3 md:mt-[72px] lg:grid-cols-6 lg:gap-10">
        {LEARNING_PATHS.map((p) => {
          const Icon = ICONS[p.slug as keyof typeof ICONS];
          return (
            <li key={p.slug}>
              <Link
                href={`/courses?category=${p.slug}`}
                className="group flex h-[166px] flex-col items-center justify-center gap-4 rounded-3xl border border-line bg-white transition-colors hover:border-ink"
              >
                <span className="grid h-[60px] w-[60px] place-items-center rounded-full bg-lime text-ink">
                  <Icon size={26} strokeWidth={1.9} />
                </span>
                <span className="text-lg">{p.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
