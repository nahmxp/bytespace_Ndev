import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 40" className={cn("h-8 w-auto", className)} aria-hidden="true">
      <path
        fill="#D4FB20"
        fillRule="evenodd"
        d="M0 8C0 3.6 3.6 0 8 0s8 3.6 8 8v4.6c1.6-1.6 3.9-2.6 6.5-2.6C28.9 10 34 15.1 34 21.5V26c0 8.8-7.2 14-15 14H8c-4.4 0-8-3.6-8-8V8Zm14.5 11.5L27 26.5l-5.7 1.8L18.6 34l-4.1-14.5Z"
      />
    </svg>
  );
}

export function Logo({
  tone = "light",
  markOnly = false,
  className,
}: {
  tone?: "light" | "dark";
  markOnly?: boolean;
  className?: string;
}) {
  return (
    <Link href="/" aria-label="ByteSpace home" className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!markOnly && (
        <span
          className={cn(
            "font-brand text-[19px] font-extrabold leading-none tracking-tight",
            tone === "light" ? "text-white" : "text-ink",
          )}
        >
          ByteSpace
        </span>
      )}
    </Link>
  );
}
