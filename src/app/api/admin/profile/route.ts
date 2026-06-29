import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Profile } from "@/models/Profile";
import { profileSchema } from "@/lib/validation";
import { withAdmin } from "@/lib/requireAdmin";

export const GET = withAdmin(async () => {
  await connectDB();
  const profile = await Profile.findOne().lean();
  return NextResponse.json({ profile });
});

export const PUT = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }

  await connectDB();
  const profile = await Profile.findOneAndUpdate({}, parsed.data, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  }).lean();

  return NextResponse.json({ ok: true, profile });
});
