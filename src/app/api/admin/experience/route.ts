import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Experience } from "@/models/Experience";
import { experienceSchema } from "@/lib/validation";
import { withAdmin } from "@/lib/requireAdmin";

export const GET = withAdmin(async () => {
  await connectDB();
  const items = await Experience.find().sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json({ items });
});

export const POST = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }
  await connectDB();
  const item = await Experience.create(parsed.data);
  return NextResponse.json({ ok: true, item }, { status: 201 });
});
