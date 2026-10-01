import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Five-star row; `value` stars are filled. */
export function Stars({ value, size = 20, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= value ? "fill-[#4b4c53] text-[#4b4c53]" : "fill-line/60 text-line/60"} aria-hidden />
      ))}
    </span>
  );
}
