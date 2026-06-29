"use client";

import { useState } from "react";
import { Briefcase, ChevronDown } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteExperience } from "@/lib/content";

export function Experience({ experiences }: { experiences: SiteExperience[] }) {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <div className="relative">
        {/* Timeline rail */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-slate-200 to-transparent dark:via-white/10 sm:left-4" />
        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <Reveal key={exp._id ?? i} delay={i * 0.05} as="div">
              <ExperienceCard exp={exp} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ExperienceCard({ exp }: { exp: SiteExperience }) {
  const [open, setOpen] = useState(false);
  const visibleBullets = open ? exp.bullets : exp.bullets.slice(0, 2);
  const hasMore = exp.bullets.length > 2;

  return (
    <div className="relative pl-10 sm:pl-14">
      <span className="absolute left-0 top-1 grid h-7 w-7 place-items-center rounded-full bg-accent text-white sm:h-9 sm:w-9">
        <Briefcase size={14} />
      </span>
      <div className="card">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-bold">{exp.role}</h3>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {exp.period}
          </span>
        </div>
        <p className="mt-1 text-sm font-semibold text-accent">
          {exp.company}
          {exp.location ? (
            <span className="font-normal text-slate-500 dark:text-slate-400">
              {" "}
              · {exp.location}
            </span>
          ) : null}
        </p>

        <ul className="mt-4 space-y-2">
          {visibleBullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
              {b}
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            suppressHydrationWarning
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
          >
            {open ? "View less" : "View more"}
            <ChevronDown
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
