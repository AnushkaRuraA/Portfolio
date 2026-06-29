import { Github, Linkedin, Mail } from "lucide-react";
import type { SiteProfile } from "@/lib/content";

export function Footer({ profile }: { profile: SiteProfile }) {
  const year = new Date().getFullYear();
  const mailHref = profile.social.email || profile.email;

  return (
    <footer className="border-t border-slate-200/70 py-10 dark:border-white/10">
      <div className="container-px flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {year} {profile.name}.
        </p>
        <div className="flex gap-4 text-slate-500 dark:text-slate-400">
          {profile.social.github && (
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-accent"
            >
              <Github size={18} />
            </a>
          )}
          {profile.social.linkedin && (
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-accent"
            >
              <Linkedin size={18} />
            </a>
          )}
          {mailHref && (
            <a href={`mailto:${mailHref}`} aria-label="Email" className="hover:text-accent">
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
