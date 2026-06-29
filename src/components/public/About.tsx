import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteProfile } from "@/lib/content";

const highlights = [
  { value: "1+ yr", label: "Production experience" },
  { value: "10+", label: "Live apps & sites shipped" },
  { value: "180+", label: "REST endpoints built" },
  { value: "E2E", label: "Architecture → deploy" },
];

export function About({ profile }: { profile: SiteProfile }) {
  return (
    <Section id="about" eyebrow="About" title="A bit about me">
      <div className="grid gap-10 md:grid-cols-5">
        <Reveal className="md:col-span-3">
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {profile.about}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div key={h.label} className="card text-center">
                <div className="text-2xl font-extrabold text-accent">
                  {h.value}
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {h.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
