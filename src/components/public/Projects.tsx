"use client";

import Image from "next/image";
import { ExternalLink, FolderGit2, Smartphone, ArrowUpRight } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteProject } from "@/lib/content";

export function Projects({ projects }: { projects: SiteProject[] }) {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  // If nothing is explicitly featured, treat everything as featured.
  const big = featured.length ? featured : projects;
  const small = featured.length ? others : [];

  return (
    <Section id="projects" eyebrow="Projects" title="Things I've built">
      <div className="grid gap-6 sm:grid-cols-2">
        {big.map((p, i) => (
          <Reveal key={p._id ?? i} delay={(i % 2) * 0.08} as="article">
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>

      {small.length > 0 && (
        <>
          <Reveal>
            <h3 className="mb-6 mt-16 text-xl font-bold tracking-tight">
              More projects
            </h3>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {small.map((p, i) => (
              <Reveal key={p._id ?? i} delay={(i % 3) * 0.06} as="article">
                <CompactCard project={p} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

function ProjectCard({ project }: { project: SiteProject }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10 dark:border-white/10 dark:bg-white/5">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-accent/15 to-purple-500/10">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-accent/60">
            <FolderGit2 size={48} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.slice(0, 8).map((t) => (
            <span key={t} className="chip text-xs">
              {t}
            </span>
          ))}
          {project.tech.length > 8 && (
            <span className="chip text-xs">+{project.tech.length - 8}</span>
          )}
        </div>

        <ProjectLinks project={project} className="mt-5" />
      </div>
    </div>
  );
}

function CompactCard({ project }: { project: SiteProject }) {
  return (
    <div className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-md hover:shadow-accent/10 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-base font-bold leading-snug">{project.title}</h4>
        <FolderGit2 size={18} className="mt-0.5 shrink-0 text-accent/60" />
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4 dark:text-slate-300">
        {project.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 5).map((t) => (
          <span key={t} className="chip text-[11px]">
            {t}
          </span>
        ))}
        {project.tech.length > 5 && (
          <span className="chip text-[11px]">+{project.tech.length - 5}</span>
        )}
      </div>
      <ProjectLinks project={project} className="mt-4" compact />
    </div>
  );
}

function ProjectLinks({
  project,
  className = "",
  compact = false,
}: {
  project: SiteProject;
  className?: string;
  compact?: boolean;
}) {
  if (!project.liveUrl && !project.appUrl) {
    return compact ? (
      <span className={`${className} text-xs text-slate-400`}>Deployed</span>
    ) : null;
  }
  const size = compact ? 14 : 15;
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          {compact ? "Visit" : "View live"}{" "}
          {compact ? <ArrowUpRight size={size} /> : <ExternalLink size={size} />}
        </a>
      )}
      {project.appUrl && (
        <a
          href={project.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          Get the app <Smartphone size={size} />
        </a>
      )}
    </div>
  );
}
