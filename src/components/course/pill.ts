import { cn } from "@/lib/utils";

/** Shared look for category pills (buttons on the landing page, links on /courses). */
export function pillClass(active: boolean, className?: string) {
  return cn(
    "inline-flex h-11 items-center rounded-full px-5 text-base transition-colors",
    active ? "bg-lime text-ink" : "bg-pill text-ink/85 hover:bg-[#e8e8ea]",
    className,
  );
}
