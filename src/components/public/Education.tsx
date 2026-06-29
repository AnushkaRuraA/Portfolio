import { GraduationCap, Award } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteEducation } from "@/lib/content";

export function Education({ education }: { education: SiteEducation[] }) {
  return (
    <Section id="education" eyebrow="Education" title="Academics & achievements">
      <div className="space-y-6">
        {education.map((edu, i) => (
          <Reveal key={edu._id ?? i} delay={i * 0.05} as="div">
            <div className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <GraduationCap size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{edu.degree}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {edu.institution}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {edu.period}
                  </p>
                  {edu.detail && (
                    <p className="text-accent">{edu.detail}</p>
                  )}
                </div>
              </div>

              {edu.achievements.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-white/5">
                  {edu.achievements.map((a, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                    >
                      <Award size={16} className="mt-0.5 shrink-0 text-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
