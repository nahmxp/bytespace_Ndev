import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { DbNotConfiguredError } from "./db";
import { fieldErrors, type FieldErrors } from "./validators";

export function apiError(status: number, message: string, fields?: FieldErrors) {
  return NextResponse.json({ ok: false, error: message, fields }, { status });
}

/** Maps unexpected errors to a safe JSON response. */
export function handleApiError(err: unknown) {
  if (err instanceof DbNotConfiguredError) return apiError(503, err.message);
  console.error("[api]", err);
  return apiError(500, "Something went wrong on our side. Please try again.");
}

/** Reads + validates a JSON body. Returns either the parsed data or a ready-to-send error response. */
export async function parseBody<T>(
  req: Request,
  schema: ZodType<T>,
  message = "Please fix the highlighted fields.",
): Promise<{ data: T; error?: undefined } | { data?: undefined; error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { error: apiError(400, "Request body must be valid JSON.") };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: apiError(400, message, fieldErrors(parsed.error)) };
  return { data: parsed.data };
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
