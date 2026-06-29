import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteSkill } from "@/lib/content";

export function Skills({ skills }: { skills: SiteSkill[] }) {
  return (
    <Section id="skills" eyebrow="Skills" title="My toolkit">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group._id ?? i} delay={(i % 3) * 0.06} as="div">
            <div className="card h-full">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
