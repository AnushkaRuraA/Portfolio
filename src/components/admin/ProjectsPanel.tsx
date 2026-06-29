"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus, Save, Trash2, Loader2, Upload, ImageOff } from "lucide-react";
import { adminFetch, withToast } from "./lib";
import { TextInput, TextArea, TagInput, Button, AdminCard } from "./ui";
import { DragList } from "./DragList";

interface Proj {
  _id?: string;
  title: string;
  description: string;
  tech: string[];
  liveUrl: string;
  appUrl: string;
  image: string;
  imagePublicId: string;
  featured: boolean;
  order: number;
}

const blank: Proj = {
  title: "",
  description: "",
  tech: [],
  liveUrl: "",
  appUrl: "",
  image: "",
  imagePublicId: "",
  featured: false,
  order: 0,
};

export function ProjectsPanel() {
  const [items, setItems] = useState<Proj[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const d = await adminFetch<{ items: Proj[] }>("/api/admin/projects");
    setItems(d.items);
  }
  useEffect(() => {
    load().catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Persist a drag reorder without reloading (so unsaved edits aren't lost).
  async function persistOrder(ordered: Proj[]) {
    setItems(ordered);
    await withToast(
      () =>
        adminFetch("/api/admin/projects/reorder", {
          method: "POST",
          body: JSON.stringify({ ids: ordered.map((p) => p._id) }),
        }),
      { success: "Order saved." }
    );
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>;

  return (
    <div className="space-y-4">
      {items.length > 1 && (
        <p className="text-xs text-slate-400">
          Tip: drag the ⋮⋮ handle on the left to reorder projects.
        </p>
      )}
      <DragList
        items={items}
        getKey={(p) => p._id!}
        onReorder={persistOrder}
        renderItem={(p) => <ProjForm key={p._id} initial={p} onChanged={load} />}
      />
      <NewProj onAdded={load} nextOrder={items.length} />
    </div>
  );
}

function ImageField({
  value,
  publicId,
  onChange,
}: {
  value: string;
  publicId: string;
  onChange: (url: string, publicId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await withToast(
      () =>
        adminFetch<{ url: string; publicId: string }>("/api/admin/upload", {
          method: "POST",
          body: fd,
        }),
      { loading: "Uploading…", success: "Image uploaded." }
    );
    if (res) onChange(res.url, res.publicId);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <span className="admin-label">Thumbnail</span>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
          {value ? (
            <Image src={value} alt="Project thumbnail" fill className="object-cover" sizes="128px" />
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-300">
              <ImageOff size={22} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
          <Button variant="ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {value ? "Replace" : "Upload"}
          </Button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("", "")}
              className="text-xs text-red-500 hover:underline"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
      {publicId && (
        <p className="mt-1 truncate text-[11px] text-slate-400">{publicId}</p>
      )}
    </div>
  );
}

function Fields({
  form,
  set,
}: {
  form: Proj;
  set: <K extends keyof Proj>(k: K) => (v: Proj[K]) => void;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Title" value={form.title} onChange={set("title")} />
        <TextInput label="Live URL" value={form.liveUrl} onChange={set("liveUrl")} placeholder="https://…" />
      </div>
      <div className="mt-4">
        <TextInput
          label="App link (optional)"
          value={form.appUrl}
          onChange={set("appUrl")}
          placeholder="Play Store / App Store URL — leave blank if none"
        />
      </div>
      <div className="mt-4">
        <TextArea label="Description" value={form.description} onChange={set("description")} rows={4} />
      </div>
      <div className="mt-4">
        <TagInput label="Tech stack" values={form.tech} onChange={set("tech")} />
      </div>
      <div className="mt-4">
        <ImageField
          value={form.image}
          publicId={form.imagePublicId}
          onChange={(url, pid) => {
            set("image")(url);
            set("imagePublicId")(pid);
          }}
        />
      </div>
      <label className="mt-4 flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set("featured")(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
        />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Featured (show as a large card; unchecked = compact “More projects”)
        </span>
      </label>
    </>
  );
}

function ProjForm({
  initial,
  onChanged,
}: {
  initial: Proj;
  onChanged: () => Promise<void>;
}) {
  const [form, setForm] = useState<Proj>(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Proj>(k: K) => (v: Proj[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setBusy(true);
    await withToast(
      () =>
        adminFetch(`/api/admin/projects/${initial._id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        }),
      { success: "Project updated." }
    );
    await onChanged();
    setBusy(false);
  }
  async function remove() {
    if (!confirm("Delete this project?")) return;
    setBusy(true);
    await withToast(
      () => adminFetch(`/api/admin/projects/${initial._id}`, { method: "DELETE" }),
      { success: "Deleted." }
    );
    await onChanged();
  }

  return (
    <AdminCard>
      <Fields form={form} set={set} />
      <div className="mt-4 flex gap-2">
        <Button onClick={save} disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
        </Button>
        <Button variant="danger" onClick={remove} disabled={busy}>
          <Trash2 size={16} /> Delete
        </Button>
      </div>
    </AdminCard>
  );
}

function NewProj({
  onAdded,
  nextOrder,
}: {
  onAdded: () => Promise<void>;
  nextOrder: number;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Proj>({ ...blank, order: nextOrder });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Proj>(k: K) => (v: Proj[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function create() {
    setBusy(true);
    const ok = await withToast(
      () =>
        adminFetch("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(form),
        }),
      { success: "Project added." }
    );
    if (ok) {
      setForm({ ...blank, order: nextOrder + 1 });
      setOpen(false);
      await onAdded();
    }
    setBusy(false);
  }

  if (!open)
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <Plus size={16} /> Add project
      </Button>
    );

  return (
    <AdminCard>
      <Fields form={form} set={set} />
      <div className="mt-4 flex gap-2">
        <Button onClick={create} disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Create
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </AdminCard>
  );
}
