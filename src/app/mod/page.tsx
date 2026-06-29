import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminFromCookies } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

// Hidden, unlinked admin route — keep it out of search indexes.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ModLoginPage() {
  const admin = await getAdminFromCookies();
  if (admin) redirect("/mod/dashboard");

  return (
    <main className="grid min-h-[100svh] place-items-center bg-slate-50 px-4 dark:bg-[#09090e]">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-lg font-bold text-white">
            AP
          </div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your portfolio content.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
