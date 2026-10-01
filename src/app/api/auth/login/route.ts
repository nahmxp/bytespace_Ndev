import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validators";
import { createSessionToken, attachSessionCookie } from "@/lib/auth";
import { apiError, handleApiError, parseBody, clientIp } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Compared against when the email is unknown so response time doesn't reveal which emails exist.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= bcrypt.hash("bytespace-timing-guard", 12));

export async function POST(req: Request) {
  try {
    if (!rateLimit(`login:${clientIp(req)}`, 10, 5 * 60_000)) {
      return apiError(429, "Too many login attempts. Please wait a few minutes and try again.");
    }

    const body = await parseBody(req, loginSchema);
    if (body.error) return body.error;
    const { email, password } = body.data;

    await connectDB();
    const user = await User.findOne({ email }).select("+passwordHash");
    const ok = await bcrypt.compare(password, user?.passwordHash ?? (await getDummyHash()));
    if (!user || !ok) return apiError(401, "Incorrect email or password.");

    const session = { id: String(user._id), name: user.name, email: user.email, role: user.role };
    const token = await createSessionToken(session);
    return attachSessionCookie(NextResponse.json({ ok: true, user: session }), token);
  } catch (err) {
    return handleApiError(err);
  }
}
