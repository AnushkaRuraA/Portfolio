"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { adminFetch, withToast } from "./lib";
import { TextInput, BulletInput, Button, AdminCard } from "./ui";
import { DragList } from "./DragList";

interface Edu {
  _id?: string;
  degree: string;
  institution: string;
  period: string;
  detail: string;
  achievements: string[];
  order: number;
}

const blank: Edu = {
  degree: "",
  institution: "",
  period: "",
  detail: "",
  achievements: [""],
  order: 0,
};

export function EducationPanel() {
  const [items, setItems] = useState<Edu[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const d = await adminFetch<{ items: Edu[] }>("/api/admin/education");
    setItems(d.items);
  }
  useEffect(() => {
    load().catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function persistOrder(ordered: Edu[]) {
    setItems(ordered);
    await withToast(
      () =>
        adminFetch("/api/admin/education/reorder", {
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
        renderItem={(e) => <Row key={e._id} initial={e} onChanged={load} />}
      />
      <NewRow onAdded={load} nextOrder={items.length} />
    </div>
  );
}

function Fields({
  form,
  set,
}: {
  form: Edu;
  set: <K extends keyof Edu>(k: K) => (v: Edu[K]) => void;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Degree" value={form.degree} onChange={set("degree")} />
        <TextInput label="Institution" value={form.institution} onChange={set("institution")} />
        <TextInput label="Period" value={form.period} onChange={set("period")} placeholder="2022 – 2026" />
        <TextInput label="Detail" value={form.detail} onChange={set("detail")} placeholder="CGPA: 7.88" />
      </div>
      <div className="mt-4">
        <BulletInput label="Achievements" values={form.achievements} onChange={set("achievements")} />
      </div>
    </>
  );
}

function Row({ initial, onChanged }: { initial: Edu; onChanged: () => Promise<void> }) {
  const [form, setForm] = useState<Edu>(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Edu>(k: K) => (v: Edu[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setBusy(true);
    await withToast(
      () => adminFetch(`/api/admin/education/${initial._id}`, { method: "PUT", body: JSON.stringify(form) }),
      { success: "Education updated." }
    );
    await onChanged();
    setBusy(false);
  }
  async function remove() {
    if (!confirm("Delete this education entry?")) return;
    setBusy(true);
    await withToast(
      () => adminFetch(`/api/admin/education/${initial._id}`, { method: "DELETE" }),
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

function NewRow({ onAdded, nextOrder }: { onAdded: () => Promise<void>; nextOrder: number }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Edu>({ ...blank, order: nextOrder });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Edu>(k: K) => (v: Edu[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function create() {
    setBusy(true);
    const ok = await withToast(
      () => adminFetch("/api/admin/education", { method: "POST", body: JSON.stringify(form) }),
      { success: "Education added." }
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
        <Plus size={16} /> Add education
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
