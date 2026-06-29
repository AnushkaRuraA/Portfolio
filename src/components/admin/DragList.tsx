"use client";

import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

interface DragListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  /** Called once on drop with the items in their new order. Persist here. */
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
}

/**
 * Lightweight drag-to-reorder list using native HTML5 drag events — no extra
 * dependency. Only the grip handle initiates a drag, so the form fields inside
 * each row stay fully usable (text selection etc.).
 */
export function DragList<T>({
  items,
  getKey,
  onReorder,
  renderItem,
}: DragListProps<T>) {
  const [list, setList] = useState<T[]>(items);
  const [enabledKey, setEnabledKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);
  const dragKey = useRef<string | null>(null);
  const changed = useRef(false);

  // Keep in sync when the parent reloads/replaces the items.
  useEffect(() => {
    setList(items);
  }, [items]);

  function onOver(targetKey: string) {
    const from = list.findIndex((i) => getKey(i) === dragKey.current);
    const to = list.findIndex((i) => getKey(i) === targetKey);
    if (from === -1 || to === -1 || from === to) return;
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setList(next);
    setOverKey(targetKey);
    changed.current = true;
  }

  function end() {
    if (changed.current) onReorder(list);
    changed.current = false;
    dragKey.current = null;
    setEnabledKey(null);
    setOverKey(null);
  }

  return (
    <div className="space-y-4">
      {list.map((item) => {
        const key = getKey(item);
        return (
          <div
            key={key}
            draggable={enabledKey === key}
            onDragStart={(e) => {
              dragKey.current = key;
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnter={() => onOver(key)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={end}
            className={`flex items-stretch gap-2 rounded-xl transition ${
              dragKey.current === key ? "opacity-60" : ""
            } ${
              overKey === key && dragKey.current !== key
                ? "ring-2 ring-accent/40"
                : ""
            }`}
          >
            <button
              type="button"
              aria-label="Drag to reorder"
              title="Drag to reorder"
              onMouseDown={() => setEnabledKey(key)}
              onMouseUp={() => setEnabledKey(null)}
              onTouchStart={() => setEnabledKey(key)}
              className="mt-3 flex h-8 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-accent active:cursor-grabbing dark:hover:bg-white/10"
            >
              <GripVertical size={18} />
            </button>
            <div className="min-w-0 flex-1">{renderItem(item)}</div>
          </div>
        );
      })}
    </div>
  );
}
