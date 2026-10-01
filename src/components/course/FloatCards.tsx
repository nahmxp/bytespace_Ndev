import { Star } from "lucide-react";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { cn } from "@/lib/utils";

const HAPPY = ["a1", "a2", "a3", "a4", "a5", "a6", "a7"];

export function HappyStudentsCard({
  tone = "white",
  className,
  style,
}: {
  tone?: "white" | "lime";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "rounded-2xl px-5 py-4 text-ink shadow-float",
        tone === "white" ? "bg-white" : "bg-lime",
        className,
      )}
    >
      <p className="text-[17px] leading-tight">Happy Students</p>
      <p className="mt-1 flex items-center gap-1 text-xs">
        <span className="font-medium">4.5</span>
        <span className="text-ink/50">(240)</span>
        <Star size={13} className={tone === "white" ? "fill-lime text-lime" : "fill-brand text-brand"} aria-hidden />
      </p>
      <AvatarStack
        avatars={HAPPY}
        count="2K+"
        size={38}
        countTone={tone === "white" ? "lime" : "black"}
        className="mt-2.5"
      />
    </div>
  );
}

export function LearningProgressCard({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div style={style} className={cn("rounded-2xl bg-white px-[14px] pb-5 pt-4 text-ink shadow-float", className)}>
      <p className="text-sm">Learning Progress</p>
      <p className="mt-1 font-display text-[44px] font-medium leading-none">55%</p>
      <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-[#e6e6e6]">
        <div className="h-full w-[55%] rounded-full bg-lime" />
      </div>
    </div>
  );
}

export function CategoryStatCard({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div style={style} className={cn("rounded-2xl bg-white px-4 py-3.5 text-ink shadow-float", className)}>
      <p className="text-[17px] leading-tight">UI/UX Design</p>
      <p className="mt-1 text-[11px] text-mute">200 Courses&nbsp;&nbsp;•&nbsp;&nbsp;1000+ Students</p>
    </div>
  );
}

export function RevenueCard({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div style={style} className={cn("rounded-2xl bg-brand p-5 text-white shadow-float", className)}>
      <p className="text-[17px] leading-tight">Total Revenue</p>
      <p className="text-[10px] text-white/80">July 1-28</p>
      <p className="mt-1.5 font-display text-2xl font-semibold leading-none">$120.29</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full w-[62%] rounded-full bg-lime" />
      </div>
    </div>
  );
}

export function YearToDateCard({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div style={style} className={cn("rounded-2xl bg-brand p-4 text-white shadow-float", className)}>
      <p className="whitespace-nowrap text-[15px] leading-tight">Year to Date</p>
      <p className="text-[10px] text-white/80">2023</p>
      <p className="mt-1.5 font-display text-xl font-semibold leading-none">$1,200.38</p>
      <span className="mt-3 inline-block rounded-full bg-lime px-2.5 py-1 text-[10px] font-medium text-ink">+12$</span>
    </div>
  );
}
