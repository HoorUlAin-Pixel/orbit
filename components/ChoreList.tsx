"use client";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Chore, Member } from "@/lib/types";

const label = (n: number) =>
  n === 1 ? "Every day" : n === 7 ? "Every week" : `Every ${n} days`;

export default function ChoreList({
  chores,
  members,
  onEdit,
  onChanged,

}: {
  chores: Chore[];
  members: Member[];
  onEdit: (c: Chore) => void;
  onChanged: () => void;
}) {
  async function remove(c: Chore) {
    if (!window.confirm(`Delete "${c.name}"? Its history will be deleted too.`)) return;
    await createClient().from("chores").delete().eq("id", c.id);
    onChanged();
  }
  const who = (c: Chore) => members.find((m) => m.id === c.pinned_to)?.name;
  if (chores.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Your chores</h2>
      {chores.map((c) => (
        <Card key={c.id} className="flex-row items-center gap-2 p-4 shadow-sm">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{c.name}</p>
            <p className="text-sm text-muted-foreground">
              {label(c.every_n_days)}
              {who(c) && ` · Pinned to ${who(c)}`}
            </p>
          </div>
          <button
            onClick={() => onEdit(c)}
            aria-label={`Edit ${c.name}`}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={() => remove(c)}
            aria-label={`Delete ${c.name}`}
            className="rounded-full p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="size-4" />
          </button>
        </Card>
      ))}
    </section>
  );
}