"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Member } from "@/lib/types";

export default function MemberList({
  householdId,
  members,
  onChange,
}: {
  householdId: string;
  members: Member[];
  onChange: () => void;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  async function add() {
    const trimmed = name.trim();
    if (!trimmed) return;
    await createClient()
      .from("members")
      .insert({ household_id: householdId, name: trimmed });
    setName("");
    setMessage("");
    onChange();
  }

  async function remove(id: string) {
    const { error } = await createClient().from("members").delete().eq("id", id);
    if (error) return setMessage("Can't remove someone who has chore history.");
    setMessage("");
    onChange();
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Household members</h2>
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <span
            key={m.id}
            className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
          >
            {m.name}
            <button
              onClick={() => remove(m.id)}
              aria-label={`Remove ${m.name}`}
              className="text-muted-foreground"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={add}>Add</Button>
      </div>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </section>
  );
}