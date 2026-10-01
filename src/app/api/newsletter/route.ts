import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";
import { newsletterSchema } from "@/lib/validators";
import { apiError, handleApiError, parseBody, clientIp } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!rateLimit(`newsletter:${clientIp(req)}`, 8, 10 * 60_000)) {
      return apiError(429, "Too many requests. Please try again later.");
    }
    const body = await parseBody(req, newsletterSchema, "Enter a valid email address.");
    if (body.error) return body.error;

    await connectDB();
    // Idempotent: subscribing twice is not an error
    await Subscriber.updateOne(
      { email: body.data.email },
      { $setOnInsert: { email: body.data.email } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true, message: "You're subscribed. Watch your inbox for updates." });
  } catch (err) {
    return handleApiError(err);
  }
}
