import Image from "next/image";
import { cn } from "@/lib/utils";

export type ShapeName = "spring-a" | "spring-b" | "spring-c" | "torus" | "cylinder" | "pyramid" | "cone";

/** Decorative 3D shape (pre-tinted lime or white). Positioned by the caller via style/className. */
export function Shape({
  name,
  tone,
  className,
  style,
  priority,
}: {
  name: ShapeName;
  tone: "lime" | "white";
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/images/shapes/${name}-${tone}.webp`}
      alt=""
      aria-hidden="true"
      width={640}
      height={640}
      priority={priority}
      draggable={false}
      className={cn("pointer-events-none absolute h-auto max-w-none select-none", className)}
      style={style}
    />
  );
}
