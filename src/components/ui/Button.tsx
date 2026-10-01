import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "lime" | "outline" | "ink";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  lime: "bg-lime text-ink hover:bg-lime-dark",
  outline: "border border-line bg-white text-ink hover:border-ink",
  ink: "bg-ink text-white hover:bg-brand",
};
const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-base",
  lg: "h-[52px] px-7 text-[17px]",
};

export function buttonClass(variant: Variant = "lime", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-normal transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

type Common = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

export function Button({
  variant,
  size,
  className,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={buttonClass(variant, size, className)} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  href,
  children,
}: Common & { href: string }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
