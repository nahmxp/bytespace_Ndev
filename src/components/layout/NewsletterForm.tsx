"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type State = { kind: "idle" | "loading" } | { kind: "ok" | "error"; message: string };

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setState({ kind: "error", message: data.fields?.email ?? data.error ?? "Could not subscribe." });
      setEmail("");
      setState({ kind: "ok", message: data.message });
    } catch {
      setState({ kind: "error", message: "Network error. Check your connection and try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-9 max-w-[500px]">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          aria-invalid={state.kind === "error"}
          aria-describedby="newsletter-status"
          className="h-[52px] w-full min-w-0 rounded-full sm:flex-1 border border-line bg-white px-6 text-[15px] placeholder:text-ink/70 focus:border-brand focus:outline-none"
        />
        <Button type="submit" size="lg" disabled={state.kind === "loading"} className="h-[46px] self-start sm:self-center">
          {state.kind === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      <p
        id="newsletter-status"
        role="status"
        className={`mt-3 min-h-5 text-sm ${state.kind === "error" ? "text-red-600" : "text-brand"}`}
      >
        {state.kind === "ok" || state.kind === "error" ? state.message : ""}
      </p>
    </form>
  );
}
