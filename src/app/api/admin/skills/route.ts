import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Skill } from "@/models/Skill";
import { skillSchema } from "@/lib/validation";
import { withAdmin } from "@/lib/requireAdmin";

export const GET = withAdmin(async () => {
  await connectDB();
  const items = await Skill.find().sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json({ items });
});

export const POST = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }
  await connectDB();
  const item = await Skill.create(parsed.data);
  return NextResponse.json({ ok: true, item }, { status: 201 });
});
