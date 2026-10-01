"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";

export function EnrollButton({ slug, loggedIn, enrolled }: { slug: string; loggedIn: boolean; enrolled: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (enrolled) {
    return (
      <div>
        <Link href={`/courses/${slug}/lessons`} className={buttonClass("lime", "lg", "w-full")}>
          Continue learning
        </Link>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-brand">
          <Check size={16} aria-hidden /> You&apos;re enrolled in this course
        </p>
      </div>
    );
  }

  async function enroll() {
    if (!loggedIn) {
      router.push(`/login?next=${encodeURIComponent(`/courses/${slug}`)}`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Couldn't enroll. Please try again.");
      router.push(`/courses/${slug}/lessons`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't enroll. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={enroll} disabled={busy} className={buttonClass("lime", "lg", "w-full")}>
        {busy ? "Enrolling…" : "Enroll Now"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
