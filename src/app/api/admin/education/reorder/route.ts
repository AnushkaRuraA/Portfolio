import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Education } from "@/models/Education";
import { withAdmin } from "@/lib/requireAdmin";

/** Persist a new ordering. Body: { ids: string[] } in the desired order. */
export const POST = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  const ids = (body as { ids?: string[] } | null)?.ids;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  await connectDB();
  await Education.bulkWrite(
    ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    }))
  );
  return NextResponse.json({ ok: true });
});
