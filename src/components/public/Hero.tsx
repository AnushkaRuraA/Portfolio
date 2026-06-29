"use client";

import { Github, Linkedin, Mail, MapPin, ArrowDown, FileDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { SiteProfile } from "@/lib/content";

export function Hero({ profile }: { profile: SiteProfile }) {
  const reduce = useReducedMotion();
  const mailHref = profile.social.email || profile.email;

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 },
    },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Backdrop */}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      <div className="container-px relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.p
            variants={item}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            <MapPin size={14} className="text-accent" />
            {profile.location}
          </motion.p>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
          >
            Hi, I&apos;m <span className="gradient-text">{profile.name}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200 sm:text-xl"
          >
            {profile.title}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn-primary">
              <Mail size={16} /> Contact Me
            </a>
            <a
              href={profile.resumeUrl || "/resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <FileDown size={16} /> View Resume
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex items-center gap-3">
            {profile.social.github && (
              <SocialLink href={profile.social.github} label="GitHub">
                <Github size={20} />
              </SocialLink>
            )}
            {profile.social.linkedin && (
              <SocialLink href={profile.social.linkedin} label="LinkedIn">
                <Linkedin size={20} />
              </SocialLink>
            )}
            {mailHref && (
              <SocialLink href={`mailto:${mailHref}`} label="Email">
                <Mail size={20} />
              </SocialLink>
            )}
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-slate-400 hover:text-accent sm:block"
      >
        <ArrowDown className="animate-bounce" size={22} />
      </a>
    </section>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent dark:border-white/10 dark:text-slate-300"
    >
      {children}
    </a>
  );
}
