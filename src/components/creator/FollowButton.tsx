"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";

/** Follow / unfollow toggle that also reports the live follower count. */
export function FollowButton({
  slug,
  loggedIn,
  initialFollowing,
  initialFollowers,
}: {
  slug: string;
  loggedIn: boolean;
  initialFollowing: boolean;
  initialFollowers: number;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [followers, setFollowers] = useState(initialFollowers);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    if (!loggedIn) {
      router.push(`/login?next=${encodeURIComponent(`/creators/${slug}`)}`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/creators/${slug}/follow`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Couldn't update. Please try again.");
      setFollowing(data.following);
      setFollowers(data.followers);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <span className="inline-flex h-[46px] items-center rounded-full bg-white px-6 text-lg text-ink" aria-live="polite">
        <span className="mr-1.5 text-brand">{followers}</span> {followers === 1 ? "Follower" : "Followers"}
      </span>
      <span className="ml-auto flex flex-col items-end">
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          aria-pressed={following}
          className={buttonClass(following ? "outline" : "lime", "lg", "on-blue h-[46px] gap-2 px-8 text-lg")}
        >
          {following && <Check size={18} aria-hidden />}
          {busy ? "…" : following ? "Following" : "Follow"}
        </button>
        {error && (
          <span role="alert" className="mt-2 text-sm text-lime">
            {error}
          </span>
        )}
      </span>
    </>
  );
}
