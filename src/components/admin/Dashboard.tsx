"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  FolderGit2,
  Wrench,
  GraduationCap,
  Inbox,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { ProfilePanel } from "./ProfilePanel";
import { ExperiencePanel } from "./ExperiencePanel";
import { ProjectsPanel } from "./ProjectsPanel";
import { SkillsPanel } from "./SkillsPanel";
import { EducationPanel } from "./EducationPanel";
import { MessagesPanel } from "./MessagesPanel";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "messages", label: "Messages", icon: Inbox },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function Dashboard({ email }: { email: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("profile");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/mod");
    router.refresh();
  }

  return (
    <div className="min-h-[100svh] bg-slate-50 dark:bg-[#09090e]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090e]/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white">
              AP
            </span>
            <div>
              <p className="text-sm font-bold leading-none">Admin Dashboard</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-accent hover:text-accent dark:border-white/15 dark:text-slate-200"
            >
              <ExternalLink size={15} /> View site
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Tab bar */}
        <nav className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-accent text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </nav>

        <div>
          {tab === "profile" && <ProfilePanel />}
          {tab === "experience" && <ExperiencePanel />}
          {tab === "projects" && <ProjectsPanel />}
          {tab === "skills" && <SkillsPanel />}
          {tab === "education" && <EducationPanel />}
          {tab === "messages" && <MessagesPanel />}
        </div>
      </div>
    </div>
  );
}
