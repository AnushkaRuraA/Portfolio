import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Education } from "@/models/Education";
import { educationSchema } from "@/lib/validation";
import { withAdmin } from "@/lib/requireAdmin";

export const PUT = withAdmin(async (req, _admin, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = educationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }
  await connectDB();
  const item = await Education.findByIdAndUpdate(id, parsed.data, {
    new: true,
  }).lean();
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, item });
});

export const DELETE = withAdmin(async (_req, _admin, ctx) => {
  const { id } = await ctx.params;
  await connectDB();
  await Education.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
});
