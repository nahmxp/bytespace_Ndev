import Image from "next/image";
import Link from "next/link";
import { Award, FileText, MessagesSquare, Video } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { EnrollButton } from "./EnrollButton";
import { formatPrice } from "@/lib/utils";
import type { CourseDetailDTO, CreatorDTO } from "@/lib/types";

const INCLUDES = [
  { Icon: FileText, label: "Learning Resources" },
  { Icon: Video, label: "Quality Lesson Videos" },
  { Icon: Award, label: "Certificate of Completion" },
  { Icon: MessagesSquare, label: "Private Consultation" },
];

const shortTitle = (t: string) => t.replace(/^Module \d+:\s*/, "");

export function CourseSidebar({
  course,
  creator,
  loggedIn,
  enrolled,
}: {
  course: CourseDetailDTO;
  creator: CreatorDTO | null;
  loggedIn: boolean;
  enrolled: boolean;
}) {
  const preview = course.modules.slice(0, 3);
  const more = Math.max(course.lessons - preview.length, 0);

  return (
    <aside className="rounded-[28px] border border-line bg-white p-7 shadow-float sm:p-[38px]" aria-label="Course summary">
      <h2 className="font-display text-[22px] font-medium leading-tight">
        {course.lessons} Lessons ({course.duration})
      </h2>

      <ol className="mt-5 space-y-3.5">
        {preview.map((m, i) => (
          <li key={m.title} className="flex items-start gap-4">
            <span className="w-6 shrink-0 pt-0.5 text-base">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1 text-base leading-snug">{shortTitle(m.title)}</span>
            <span className="shrink-0 pt-0.5 text-base text-brand">{m.minutes} mins</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-base text-[#4b4c53]">{more} more videos</p>

      <p className="mt-8 text-base leading-[1.75] text-[#4b4c53]">
        Ready to Dive In? Enroll Now and Start Building Your Digital Future!
      </p>

      <p className="mt-7 text-base text-mute">
        <span className="font-display text-[34px] font-semibold text-brand">{formatPrice(course.price)}</span>/lifetime
      </p>
      <div className="mt-4">
        <EnrollButton slug={course.slug} loggedIn={loggedIn} enrolled={enrolled} />
      </div>

      <h3 className="mt-9 font-display text-[22px] font-medium">This course include</h3>
      <ul className="mt-5 space-y-4">
        {INCLUDES.map(({ Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-base text-[#4b4c53]">
            <Icon size={22} className="text-brand" strokeWidth={1.8} aria-hidden />
            {label}
          </li>
        ))}
      </ul>

      {creator && (
        <>
          <hr className="mt-7 border-line" />
          <div className="mt-6 flex items-center gap-4">
            <Image src={creator.avatar} alt="" width={100} height={100} className="h-[50px] w-[50px] rounded-full object-cover" />
            <div>
              <p className="text-lg leading-tight">{creator.name}</p>
              <p className="text-base text-[#4b4c53]">Professional Creator</p>
            </div>
          </div>
          <p className="mt-6 text-base leading-[1.75] text-[#4b4c53]">
            Ready to Dive In? Enroll Now and Start Building Your Digital Future!
          </p>
          <Link href={`/creators/${creator.slug}`} className={buttonClass("outline", "md", "mt-5 h-10 px-5 text-[15px]")}>
            See Full Profile
          </Link>
        </>
      )}
    </aside>
  );
}
