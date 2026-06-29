"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Reply } from "lucide-react";
import { adminFetch, withToast } from "./lib";
import { Button } from "./ui";

interface Msg {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function MessagesPanel() {
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const d = await adminFetch<{ items: Msg[] }>("/api/admin/submissions");
    setItems(d.items);
  }
  useEffect(() => {
    load().catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function toggleRead(m: Msg) {
    setItems((arr) => arr.map((x) => (x._id === m._id ? { ...x, read: !x.read } : x)));
    await adminFetch(`/api/admin/submissions/${m._id}`, {
      method: "PATCH",
      body: JSON.stringify({ read: !m.read }),
    }).catch(() => load());
  }

  async function remove(m: Msg) {
    if (!confirm("Delete this message?")) return;
    await withToast(
      () => adminFetch(`/api/admin/submissions/${m._id}`, { method: "DELETE" }),
      { success: "Message deleted." }
    );
    await load();
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>;

  if (items.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-white/10">
        No messages yet.
      </div>
    );

  return (
    <div className="space-y-3">
      {items.map((m) => (
        <div
          key={m._id}
          className={`rounded-xl border p-4 transition ${
            m.read
              ? "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
              : "border-accent/30 bg-accent/5"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                {!m.read && <span className="h-2 w-2 rounded-full bg-accent" />}
                <h3 className="font-semibold">{m.subject}</h3>
              </div>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {m.name} · {m.email}
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {new Date(m.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
            {m.message}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => toggleRead(m)}>
              {m.read ? <Mail size={15} /> : <MailOpen size={15} />}
              Mark as {m.read ? "unread" : "read"}
            </Button>
            <a
              href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent dark:border-white/15 dark:text-slate-200"
            >
              <Reply size={15} /> Reply
            </a>
            <Button variant="danger" onClick={() => remove(m)}>
              <Trash2 size={15} /> Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
