import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { projectSchema } from "@/lib/validation";
import { withAdmin } from "@/lib/requireAdmin";
import { deleteImage } from "@/lib/cloudinary";

export const PUT = withAdmin(async (req, _admin, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }

  await connectDB();
  const existing = await Project.findById(id);
  if (!existing)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  // If the image changed and the old one was on Cloudinary, clean it up.
  if (
    existing.imagePublicId &&
    existing.imagePublicId !== parsed.data.imagePublicId
  ) {
    await deleteImage(existing.imagePublicId);
  }

  existing.set(parsed.data);
  await existing.save();
  return NextResponse.json({ ok: true, item: existing.toObject() });
});

export const DELETE = withAdmin(async (_req, _admin, ctx) => {
  const { id } = await ctx.params;
  await connectDB();
  const item = await Project.findByIdAndDelete(id);
  if (item?.imagePublicId) {
    await deleteImage(item.imagePublicId);
  }
  return NextResponse.json({ ok: true });
});
