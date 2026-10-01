import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/lib/validators";
import { createSessionToken, attachSessionCookie } from "@/lib/auth";
import { apiError, handleApiError, parseBody, clientIp } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!rateLimit(`register:${clientIp(req)}`, 10, 10 * 60_000)) {
      return apiError(429, "Too many attempts. Please wait a few minutes and try again.");
    }

    const body = await parseBody(req, registerSchema);
    if (body.error) return body.error;
    const { name, email, password } = body.data;

    await connectDB();

    if (await User.exists({ email })) {
      return apiError(409, "An account with this email already exists.", {
        email: "An account with this email already exists. Try logging in.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let user;
    try {
      user = await User.create({ name, email, passwordHash });
    } catch (err) {
      // Lost a race with a concurrent signup for the same email
      if ((err as { code?: number }).code === 11000) {
        return apiError(409, "An account with this email already exists.", {
          email: "An account with this email already exists. Try logging in.",
        });
      }
      throw err;
    }

    const session = { id: String(user._id), name: user.name, email: user.email, role: user.role };
    const token = await createSessionToken(session);
    return attachSessionCookie(NextResponse.json({ ok: true, user: session }, { status: 201 }), token);
  } catch (err) {
    return handleApiError(err);
  }
}
