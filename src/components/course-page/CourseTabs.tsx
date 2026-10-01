"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pillClass } from "@/components/course/pill";

export function CourseTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/courses/${slug}`;
  const tabs = [
    { href: base, label: "About" },
    { href: `${base}/lessons`, label: "Lessons" },
    { href: `${base}/reviews`, label: "Reviews" },
  ];
  return (
    <nav aria-label="Course sections" className="flex flex-wrap gap-3">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link key={t.href} href={t.href} scroll={false} aria-current={active ? "page" : undefined} className={pillClass(active, "h-[46px] px-6")}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
