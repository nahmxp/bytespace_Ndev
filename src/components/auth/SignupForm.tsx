"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "./AuthShell";
import { Field } from "./Field";
import { useAuthSubmit } from "./useAuthSubmit";

export function SignupForm({ next }: { next: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { submit, loading, formError, fieldErrors, setFieldErrors } = useAuthSubmit("/api/auth/register", next);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Enter your full name (at least 2 characters).";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "Enter a valid email address.";
    if (password.length < 8) errs.password = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) errs.password = "Include at least one letter and one number.";
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    submit({ name, email, password });
  }

  return (
    <AuthCard>
      <p className="text-lg text-brand">Create an Account</p>
      <h1 className="mt-1 font-display text-[40px] font-semibold leading-[1.1] sm:text-5xl">
        Welcome to
        <br />
        ByteSpace
      </h1>

      <form onSubmit={onSubmit} noValidate className="mt-9 space-y-5">
        <Field label="Full Name" name="name" placeholder="Jamie Davis" autoComplete="name" value={name} onChange={setName} error={fieldErrors.name} />
        <Field label="Email" name="email" type="email" placeholder="designer@example.com" autoComplete="email" value={email} onChange={setEmail} error={fieldErrors.email} />
        <Field label="Password" name="password" type="password" placeholder="********" autoComplete="new-password" value={password} onChange={setPassword} error={fieldErrors.password} />

        {formError && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </p>
        )}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={loading} className="h-[46px]">
            {loading ? "Creating account…" : "Continue"}
          </Button>
        </div>
      </form>

      <p className="mt-auto pt-10 text-center text-mute">
        Already have an account?{" "}
        <Link href="/login" className="text-brand hover:underline">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
