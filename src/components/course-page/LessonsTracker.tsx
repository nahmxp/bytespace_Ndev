"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Video } from "lucide-react";
import type { ModuleDTO } from "@/lib/types";

export function LessonsTracker({
  slug,
  modules,
  enrolled,
  loggedIn,
  initialCompleted,
}: {
  slug: string;
  modules: ModuleDTO[];
  enrolled: boolean;
  loggedIn: boolean;
  initialCompleted: number[];
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [pending, setPending] = useState<number | null>(null);
  const [error, setError] = useState("");

  const percent = modules.length ? Math.round((completed.length / modules.length) * 100) : 0;

  async function toggle(index: number) {
    const done = !completed.includes(index);
    setPending(index);
    setError("");
    try {
      const res = await fetch("/api/enrollments/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, module: index, done }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Couldn't save your progress.");
      setCompleted(data.completed);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save your progress.");
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <h3 className="mt-10 font-display text-[22px] font-medium">Lesson List</h3>
      <ul className="mt-5 space-y-5">
        {modules.map((m, i) => {
          const done = completed.includes(i);
          return (
            <li key={m.title} className="flex items-start gap-4">
              <span className="grid h-[68px] w-[68px] shrink-0 place-items-center rounded-2xl bg-lime text-ink" aria-hidden>
                <Video size={30} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-base font-medium ${done ? "text-brand" : ""}`}>{m.title}</p>
                <p className="mt-1 text-[15px] leading-[1.6] text-[#4b4c53]">{m.summary}</p>
                <p className="mt-1 text-sm text-mute">{m.minutes} mins</p>
              </div>
              {enrolled && (
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  disabled={pending === i}
                  aria-pressed={done}
                  aria-label={done ? `Mark module ${i + 1} as not complete` : `Mark module ${i + 1} as complete`}
                  className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                    done ? "border-brand bg-brand text-white" : "border-line text-transparent hover:border-brand"
                  }`}
                >
                  <Check size={16} strokeWidth={3} />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <h3 className="mt-10 font-display text-[22px] font-medium">Lesson Content</h3>
      <p className="mt-4 text-base leading-[1.7] text-[#4b4c53]">
        Engage with each lesson through captivating video content, detailed textual explanations, and interactive
        elements. Download resources, complete assignments, and test your understanding with quizzes.
      </p>

      <h3 className="mt-10 font-display text-[22px] font-medium">Lesson Progress Tracking</h3>
      <p className="mt-4 text-base leading-[1.7] text-[#4b4c53]">
        Witness your growth as you complete lessons, with an intuitive progress tracking feature guiding you through
        your learning journey.
      </p>

      <div className="mt-6 rounded-2xl border border-line p-6">
        <p className="text-sm">Learning Progress</p>
        <p className="mt-1 font-display text-[44px] font-medium leading-none">{percent}%</p>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-[#e6e6e6]"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Learning progress"
        >
          <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${percent}%` }} />
        </div>
        {!enrolled && (
          <p className="mt-4 text-sm text-mute">
            {loggedIn ? (
              "Enroll in this course to start tracking your progress."
            ) : (
              <>
                <Link href={`/login?next=${encodeURIComponent(`/courses/${slug}/lessons`)}`} className="text-brand hover:underline">
                  Log in
                </Link>{" "}
                and enroll to track your progress.
              </>
            )}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
