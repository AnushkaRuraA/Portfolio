import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Experience } from "@/models/Experience";
import { experienceSchema } from "@/lib/validation";
import { withAdmin } from "@/lib/requireAdmin";

export const PUT = withAdmin(async (req, _admin, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }
  await connectDB();
  const item = await Experience.findByIdAndUpdate(id, parsed.data, {
    new: true,
  }).lean();
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, item });
});

export const DELETE = withAdmin(async (_req, _admin, ctx) => {
  const { id } = await ctx.params;
  await connectDB();
  await Experience.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
});
