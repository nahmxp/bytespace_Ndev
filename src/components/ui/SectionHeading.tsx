import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  align = "center",
  size = "lg",
  as: Tag = "h2",
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  size?: "md" | "lg";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto text-center" : "text-left", className)}>
      <Tag
        className={cn(
          "font-semibold text-ink",
          size === "lg" ? "text-[34px] leading-[1.2] md:text-[44px]" : "text-[28px] leading-tight md:text-[35px]",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed text-mute md:text-lg", align === "center" && "mx-auto max-w-[920px]")}>
          {description}
        </p>
      )}
    </div>
  );
}
