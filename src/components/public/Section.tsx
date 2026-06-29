import { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/** Shared section shell with a consistent eyebrow + title header. */
export function Section({ id, eyebrow, title, children, className }: SectionProps) {
  return (
    <section id={id} className={`section ${className ?? ""}`}>
      <div className="container-px">
        <Reveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            {eyebrow}
          </p>
          <h2 className="section-title mb-10">{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
