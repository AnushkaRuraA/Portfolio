import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { loginSchema } from "@/lib/validation";
import { signAdminToken, AUTH_COOKIE, cookieOptions } from "@/lib/auth";
import { checkRateLimit, registerFailure, clearAttempts } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Throttle by client IP to slow brute-force attempts.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${Math.ceil(
          (limit.retryAfterSec || 0) / 60
        )} minute(s).`,
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  try {
    await connectDB();
    const admin = await Admin.findOne({ email });

    // Generic error message either way to avoid leaking which part failed.
    const ok =
      admin && (await bcrypt.compare(parsed.data.password, admin.passwordHash));

    if (!ok || !admin) {
      registerFailure(ip);
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    clearAttempts(ip);
    const token = signAdminToken({
      sub: String(admin._id),
      email: admin.email,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE, token, cookieOptions);
    return res;
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
