import Image from "next/image";
import { cn } from "@/lib/utils";

const DEFAULT = ["a1", "a2", "a3", "a4"];

export function AvatarStack({
  avatars = DEFAULT,
  count,
  size = 30,
  countTone = "lime",
  className,
}: {
  avatars?: string[];
  count: string;
  size?: number;
  countTone?: "lime" | "black";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center", className)} aria-label={`${count} students`}>
      {avatars.map((a, i) => (
        <Image
          key={a}
          src={`/images/avatars/${a}.webp`}
          alt=""
          width={size * 2}
          height={size * 2}
          style={{ width: size, height: size, marginLeft: i === 0 ? 0 : -size * 0.28 }}
          className="rounded-full border-2 border-white object-cover"
        />
      ))}
      <span
        style={{ width: size, height: size, marginLeft: -size * 0.28, fontSize: Math.max(10, size * (count.length > 3 ? 0.3 : 0.36)) }}
        className={cn(
          "grid place-items-center rounded-full border-2 border-white font-medium leading-none",
          countTone === "lime" ? "bg-lime text-ink" : "bg-black text-white",
        )}
      >
        {count}
      </span>
    </div>
  );
}
