import Image from "next/image";
import { notFound } from "next/navigation";
import { getCourseDetail } from "@/lib/courses";

function Check() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
      <circle cx="11" cy="11" r="11" fill="#003BE2" />
      <path d="M6.2 11.3l3.3 3.2 6.3-6.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function CourseAboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const course = await getCourseDetail((await params).slug);
  if (!course) notFound();

  return (
    <div>
      <h2 className="mt-10 font-display text-[22px] font-medium">Description</h2>
      <div className="mt-5 space-y-6">
        {course.description.map((p, i) => (
          <p key={i} className="text-base leading-[1.75] text-[#4b4c53]">
            {p}
          </p>
        ))}
      </div>

      <h2 className="mt-10 font-display text-[22px] font-medium">Sneak Peak</h2>
      <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {course.gallery.map((src, i) => (
          <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-pill">
            <Image src={src} alt={`Course preview ${i + 1}`} fill sizes="(min-width:640px) 170px, 45vw" className="object-cover" />
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-[22px] font-medium">Key Points</h2>
      <ul className="mt-5 space-y-3.5">
        {course.keyPoints.map((k) => (
          <li key={k} className="flex items-center gap-3 text-base text-[#4b4c53]">
            <Check />
            {k}
          </li>
        ))}
      </ul>
    </div>
  );
}
