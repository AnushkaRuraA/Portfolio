"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Loader2 } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteProfile } from "@/lib/content";

const initial = { name: "", email: "", subject: "", message: "" };

export function Contact({ profile }: { profile: SiteProfile }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const mailHref = profile.social.email || profile.email;

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (form.subject.trim().length < 2) e.subject = "Add a subject.";
    if (form.message.trim().length < 10)
      e.message = "Message should be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      toast.success("Message sent! I'll get back to you soon.");
      setForm(initial);
      setErrors({});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send.");
    } finally {
      setLoading(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Section id="contact" eyebrow="Contact" title="Let's work together">
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Have a project in mind or just want to say hi? Drop me a message and
            I&apos;ll respond as soon as I can.
          </p>
          <div className="mt-8 space-y-4">
            {mailHref && (
              <ContactItem icon={<Mail size={18} />} href={`mailto:${mailHref}`}>
                {mailHref}
              </ContactItem>
            )}
            {profile.phone && (
              <ContactItem
                icon={<Phone size={18} />}
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
              >
                {profile.phone}
              </ContactItem>
            )}
            {profile.location && (
              <ContactItem icon={<MapPin size={18} />}>
                {profile.location}
              </ContactItem>
            )}
          </div>
          <div className="mt-8 flex gap-3">
            {profile.social.github && (
              <IconLink href={profile.social.github} label="GitHub">
                <Github size={20} />
              </IconLink>
            )}
            {profile.social.linkedin && (
              <IconLink href={profile.social.linkedin} label="LinkedIn">
                <Linkedin size={20} />
              </IconLink>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} noValidate className="card space-y-4">
            <Field label="Name" error={errors.name}>
              <input
                suppressHydrationWarning
                className="input"
                value={form.name}
                onChange={set("name")}
                placeholder="Your name"
                autoComplete="name"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                suppressHydrationWarning
                className="input"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Subject" error={errors.subject}>
              <input
                suppressHydrationWarning
                className="input"
                value={form.subject}
                onChange={set("subject")}
                placeholder="What's this about?"
              />
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea
                suppressHydrationWarning
                className="input min-h-[120px] resize-y"
                value={form.message}
                onChange={set("message")}
                placeholder="Tell me a little about it…"
              />
            </Field>
            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </button>
          </form>
        </Reveal>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          background: rgba(255, 255, 255, 0.7);
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
          color: inherit;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.dark .input) {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
        }
        :global(.input:focus) {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </Section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function ContactItem({
  icon,
  href,
  children,
}: {
  icon: React.ReactNode;
  href?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <span className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
        {icon}
      </span>
      {children}
    </span>
  );
  return href ? (
    <a href={href} className="block transition-colors hover:text-accent">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

function IconLink({
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
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent dark:border-white/10 dark:text-slate-300"
    >
      {children}
    </a>
  );
}
