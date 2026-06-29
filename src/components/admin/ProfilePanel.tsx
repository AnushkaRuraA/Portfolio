"use client";

import { useEffect, useRef, useState } from "react";
import { Save, Loader2, Upload } from "lucide-react";
import { adminFetch, withToast } from "./lib";
import { TextInput, TextArea, Button, AdminCard } from "./ui";

interface ProfileForm {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  about: string;
  resumeUrl: string;
  social: { github: string; linkedin: string; email: string };
}

const empty: ProfileForm = {
  name: "",
  title: "",
  tagline: "",
  location: "",
  email: "",
  phone: "",
  about: "",
  resumeUrl: "/resume.pdf",
  social: { github: "", linkedin: "", email: "" },
};

export function ProfilePanel() {
  const [form, setForm] = useState<ProfileForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ profile: ProfileForm | null }>("/api/admin/profile")
      .then((d) => {
        if (d.profile) setForm({ ...empty, ...d.profile, social: { ...empty.social, ...d.profile.social } });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof ProfileForm) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k: keyof ProfileForm["social"]) => (v: string) =>
    setForm((f) => ({ ...f, social: { ...f.social, [k]: v } }));

  async function save() {
    setSaving(true);
    await withToast(
      () =>
        adminFetch("/api/admin/profile", {
          method: "PUT",
          body: JSON.stringify(form),
        }),
      { loading: "Saving…", success: "Profile saved." }
    );
    setSaving(false);
  }

  if (loading)
    return <div className="text-sm text-slate-500">Loading profile…</div>;

  return (
    <AdminCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Name" value={form.name} onChange={set("name")} />
        <TextInput label="Title" value={form.title} onChange={set("title")} />
      </div>
      <div className="mt-4">
        <TextArea
          label="Tagline"
          value={form.tagline}
          onChange={set("tagline")}
          rows={2}
        />
      </div>
      <div className="mt-4">
        <TextArea label="About / Summary" value={form.about} onChange={set("about")} rows={5} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <TextInput label="Location" value={form.location} onChange={set("location")} />
        <TextInput label="Email" value={form.email} onChange={set("email")} />
        <TextInput label="Phone" value={form.phone} onChange={set("phone")} />
      </div>
      <div className="mt-4">
        <TextInput
          label="Resume URL"
          value={form.resumeUrl}
          onChange={set("resumeUrl")}
          placeholder="/resume.pdf or an uploaded link"
        />
        <ResumeUpload onUploaded={(url) => set("resumeUrl")(url)} />
        <p className="mt-1 text-xs text-slate-400">
          Upload a PDF to host it on Cloudinary, or point this at a file in
          /public (e.g. <code>/resume.pdf</code>). Remember to click “Save
          profile” after uploading.
        </p>
      </div>

      <h3 className="mt-6 mb-2 text-sm font-bold uppercase tracking-wider text-slate-500">
        Social links
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <TextInput label="GitHub URL" value={form.social.github} onChange={setSocial("github")} />
        <TextInput label="LinkedIn URL" value={form.social.linkedin} onChange={setSocial("linkedin")} />
        <TextInput label="Public email" value={form.social.email} onChange={setSocial("email")} />
      </div>

      <div className="mt-6">
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save profile
        </Button>
      </div>
    </AdminCard>
  );
}

function ResumeUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please choose a PDF file.");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", "resume");
    const res = await withToast(
      () =>
        adminFetch<{ url: string }>("/api/admin/upload", {
          method: "POST",
          body: fd,
        }),
      { loading: "Uploading resume…", success: "Resume uploaded." }
    );
    if (res) onUploaded(res.url);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={onFile}
        className="hidden"
      />
      <Button
        variant="ghost"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Upload size={16} />
        )}
        Upload PDF
      </Button>
    </div>
  );
}
