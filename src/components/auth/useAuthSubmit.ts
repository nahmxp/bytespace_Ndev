"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Result = { ok: boolean; error?: string; fields?: Record<string, string> };

/** Shared submit logic for the login and signup forms. */
export function useAuthSubmit(endpoint: string, next: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(body: Record<string, string>) {
    setLoading(true);
    setFormError("");
    setFieldErrors({});
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: Result = await res.json().catch(() => ({ ok: false, error: "Unexpected server response." }));
      if (!res.ok || !data.ok) {
        setFieldErrors(data.fields ?? {});
        setFormError(data.fields && Object.keys(data.fields).length ? "" : (data.error ?? "Something went wrong."));
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setFormError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, formError, fieldErrors, setFieldErrors, setFormError };
}
