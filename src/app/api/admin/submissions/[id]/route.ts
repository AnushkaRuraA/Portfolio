import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactSubmission } from "@/models/ContactSubmission";
import { withAdmin } from "@/lib/requireAdmin";

// Toggle / set read status.
export const PATCH = withAdmin(async (req, _admin, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const read = Boolean((body as { read?: boolean }).read);
  await connectDB();
  const item = await ContactSubmission.findByIdAndUpdate(
    id,
    { read },
    { new: true }
  ).lean();
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, item });
});

export const DELETE = withAdmin(async (_req, _admin, ctx) => {
  const { id } = await ctx.params;
  await connectDB();
  await ContactSubmission.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
});
