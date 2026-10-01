"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user dismissed the share sheet, nothing to do */
    }
  }

  return (
    <button type="button" onClick={share} className={buttonClass("lime", "md", "on-blue shrink-0 gap-2")}>
      <Share2 size={18} aria-hidden />
      <span aria-live="polite">{copied ? "Link copied!" : "Share"}</span>
    </button>
  );
}
