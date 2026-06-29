import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactSubmission } from "@/models/ContactSubmission";
import { contactSchema } from "@/lib/validation";
import { sendContactNotification, sendAutoReply } from "@/lib/mailer";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Anti-spam: max 5 submissions per 10 minutes per IP.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again a little later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Server-side validation (mirrors the client).
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Validation failed." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // 1) Persist to MongoDB.
  try {
    await connectDB();
    await ContactSubmission.create({ ...data, read: false });
  } catch (err) {
    console.error("contact: DB save failed", err);
    return NextResponse.json(
      { error: "Could not save your message. Please try again later." },
      { status: 500 }
    );
  }

  // 2) Send email notification (+ optional auto-reply). Don't fail the request
  //    if email is misconfigured — the message is already safely stored.
  try {
    await sendContactNotification(data);
    await sendAutoReply(data);
  } catch (err) {
    console.error("contact: email send failed (message was saved)", err);
    return NextResponse.json(
      {
        ok: true,
        warning: "Saved, but email notification could not be sent.",
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
