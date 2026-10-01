import { Aperture, Blocks, Sun, Waves, Zap } from "lucide-react";

const LOGOS = [
  { Icon: Waves, round: false },
  { Icon: Sun, round: false },
  { Icon: Zap, round: true },
  { Icon: Blocks, round: true },
  { Icon: Aperture, round: true },
];

/** Placeholder partner logos (the design uses "Logoipsum" placeholders). */
export function LogoStrip() {
  return (
    <section aria-label="Trusted by" className="bg-surface">
      <ul className="mx-auto flex max-w-page flex-wrap items-center justify-center gap-x-12 gap-y-6 px-5 py-14 md:justify-between md:py-20">
        {LOGOS.map(({ Icon, round }, i) => (
          <li key={i} className="flex items-center gap-2.5 text-[#858891]">
            <span
              className={
                round
                  ? "grid h-9 w-9 place-items-center rounded-full bg-[#858891] text-surface"
                  : "grid h-9 w-9 place-items-center"
              }
            >
              <Icon size={round ? 19 : 34} strokeWidth={round ? 2.4 : 1.6} />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">Logoipsum</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
