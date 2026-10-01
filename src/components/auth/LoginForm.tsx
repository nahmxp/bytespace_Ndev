"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "./AuthShell";
import { Field } from "./Field";
import { SocialButtons } from "./SocialButtons";
import { useAuthSubmit } from "./useAuthSubmit";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { submit, loading, formError, fieldErrors, setFieldErrors } = useAuthSubmit("/api/auth/login", next);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Enter your password.";
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    submit({ email, password });
  }

  return (
    <AuthCard>
      <p className="text-lg text-brand">Sign In</p>
      <h1 className="mt-1 font-display text-[40px] font-semibold leading-[1.1] sm:text-5xl">Welcome Back</h1>

      <form onSubmit={onSubmit} noValidate className="mt-10 space-y-5">
        <Field label="Email" name="email" type="email" placeholder="designer@example.com" autoComplete="email" value={email} onChange={setEmail} error={fieldErrors.email} />
        <Field label="Password" name="password" type="password" placeholder="********" autoComplete="current-password" value={password} onChange={setPassword} error={fieldErrors.password} />

        {formError && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </p>
        )}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={loading} className="h-[46px]">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </form>

      <div className="mt-10">
        <SocialButtons />
      </div>

      <p className="mt-auto pt-10 text-center text-mute">
        New user?{" "}
        <Link href="/signup" className="text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
