import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactSubmission } from "@/models/ContactSubmission";
import { withAdmin } from "@/lib/requireAdmin";

export const GET = withAdmin(async () => {
  await connectDB();
  const items = await ContactSubmission.find()
    .sort({ createdAt: -1 })
    .lean();
  const unread = items.filter((i) => !i.read).length;
  return NextResponse.json({ items, unread });
});
