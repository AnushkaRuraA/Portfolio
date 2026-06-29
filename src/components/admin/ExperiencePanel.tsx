"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { adminFetch, withToast } from "./lib";
import { TextInput, BulletInput, Button, AdminCard } from "./ui";
import { DragList } from "./DragList";

interface Exp {
  _id?: string;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  order: number;
}

const blank: Exp = {
  role: "",
  company: "",
  location: "",
  period: "",
  bullets: [""],
  order: 0,
};

export function ExperiencePanel() {
  const [items, setItems] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const d = await adminFetch<{ items: Exp[] }>("/api/admin/experience");
    setItems(d.items);
  }

  useEffect(() => {
    load().catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Persist a drag reorder without reloading (so unsaved edits aren't lost).
  async function persistOrder(ordered: Exp[]) {
    setItems(ordered);
    await withToast(
      () =>
        adminFetch("/api/admin/experience/reorder", {
          method: "POST",
          body: JSON.stringify({ ids: ordered.map((e) => e._id) }),
        }),
      { success: "Order saved." }
    );
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>;

  return (
    <div className="space-y-4">
      {items.length > 1 && (
        <p className="text-xs text-slate-400">
          Tip: drag the ⋮⋮ handle on the left to reorder entries.
        </p>
      )}
      <DragList
        items={items}
        getKey={(e) => e._id!}
        onReorder={persistOrder}
        renderItem={(item) => (
          <ExpForm key={item._id} initial={item} onChanged={load} />
        )}
      />
      <NewExp onAdded={load} nextOrder={items.length} />
    </div>
  );
}

function ExpForm({
  initial,
  onChanged,
}: {
  initial: Exp;
  onChanged: () => Promise<void>;
}) {
  const [form, setForm] = useState<Exp>(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Exp>(k: K) => (v: Exp[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setBusy(true);
    await withToast(
      () =>
        adminFetch(`/api/admin/experience/${initial._id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        }),
      { success: "Experience updated." }
    );
    await onChanged();
    setBusy(false);
  }

  async function remove() {
    if (!confirm("Delete this experience entry?")) return;
    setBusy(true);
    await withToast(
      () =>
        adminFetch(`/api/admin/experience/${initial._id}`, { method: "DELETE" }),
      { success: "Deleted." }
    );
    await onChanged();
  }

  return (
    <AdminCard>
      <FormFields form={form} set={set} />
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

function NewExp({
  onAdded,
  nextOrder,
}: {
  onAdded: () => Promise<void>;
  nextOrder: number;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Exp>({ ...blank, order: nextOrder });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Exp>(k: K) => (v: Exp[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function create() {
    setBusy(true);
    const ok = await withToast(
      () =>
        adminFetch("/api/admin/experience", {
          method: "POST",
          body: JSON.stringify(form),
        }),
      { success: "Experience added." }
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
        <Plus size={16} /> Add experience
      </Button>
    );

  return (
    <AdminCard>
      <FormFields form={form} set={set} />
      <div className="mt-4 flex gap-2">
        <Button onClick={create} disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Create
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </AdminCard>
  );
}

function FormFields({
  form,
  set,
}: {
  form: Exp;
  set: <K extends keyof Exp>(k: K) => (v: Exp[K]) => void;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Role" value={form.role} onChange={set("role")} />
        <TextInput label="Company" value={form.company} onChange={set("company")} />
        <TextInput label="Location" value={form.location} onChange={set("location")} />
        <TextInput label="Period" value={form.period} onChange={set("period")} placeholder="Feb 2026 – Present" />
      </div>
      <div className="mt-4">
        <BulletInput label="Bullet points" values={form.bullets} onChange={set("bullets")} />
      </div>
    </>
  );
}
