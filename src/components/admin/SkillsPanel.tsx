"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { adminFetch, withToast } from "./lib";
import { TextInput, TagInput, Button, AdminCard } from "./ui";
import { DragList } from "./DragList";

interface Skill {
  _id?: string;
  category: string;
  items: string[];
  order: number;
}

const blank: Skill = { category: "", items: [], order: 0 };

export function SkillsPanel() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const d = await adminFetch<{ items: Skill[] }>("/api/admin/skills");
    setItems(d.items);
  }
  useEffect(() => {
    load().catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function persistOrder(ordered: Skill[]) {
    setItems(ordered);
    await withToast(
      () =>
        adminFetch("/api/admin/skills/reorder", {
          method: "POST",
          body: JSON.stringify({ ids: ordered.map((s) => s._id) }),
        }),
      { success: "Order saved." }
    );
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>;

  return (
    <div className="space-y-4">
      {items.length > 1 && (
        <p className="text-xs text-slate-400">
          Tip: drag the ⋮⋮ handle on the left to reorder skill groups.
        </p>
      )}
      <DragList
        items={items}
        getKey={(s) => s._id!}
        onReorder={persistOrder}
        renderItem={(s) => <Row key={s._id} initial={s} onChanged={load} />}
      />
      <NewRow onAdded={load} nextOrder={items.length} />
    </div>
  );
}

function Fields({
  form,
  set,
}: {
  form: Skill;
  set: <K extends keyof Skill>(k: K) => (v: Skill[K]) => void;
}) {
  return (
    <>
      <TextInput label="Category" value={form.category} onChange={set("category")} />
      <div className="mt-4">
        <TagInput label="Skills" values={form.items} onChange={set("items")} />
      </div>
    </>
  );
}

function Row({ initial, onChanged }: { initial: Skill; onChanged: () => Promise<void> }) {
  const [form, setForm] = useState<Skill>(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Skill>(k: K) => (v: Skill[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setBusy(true);
    await withToast(
      () => adminFetch(`/api/admin/skills/${initial._id}`, { method: "PUT", body: JSON.stringify(form) }),
      { success: "Skill group updated." }
    );
    await onChanged();
    setBusy(false);
  }
  async function remove() {
    if (!confirm("Delete this skill group?")) return;
    setBusy(true);
    await withToast(
      () => adminFetch(`/api/admin/skills/${initial._id}`, { method: "DELETE" }),
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
  const [form, setForm] = useState<Skill>({ ...blank, order: nextOrder });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Skill>(k: K) => (v: Skill[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function create() {
    setBusy(true);
    const ok = await withToast(
      () => adminFetch("/api/admin/skills", { method: "POST", body: JSON.stringify(form) }),
      { success: "Skill group added." }
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
        <Plus size={16} /> Add skill group
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
