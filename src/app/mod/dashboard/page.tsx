import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminFromCookies } from "@/lib/auth";
import { Dashboard } from "@/components/admin/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/mod");

  return <Dashboard email={admin.email} />;
}
