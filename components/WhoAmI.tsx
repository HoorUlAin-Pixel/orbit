"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Member } from "@/lib/types";

export default function WhoAmI({
  householdId,
  members,
  onClaimed,
}: {
  householdId: string;
  members: Member[];
  onClaimed: () => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function claim(memberId: string) {
    const { error } = await createClient().rpc("claim_member", { p_member: memberId });
    if (error) return setError(error.message);
    onClaimed();
  }

  async function addMe() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { data, error } = await createClient()
      .from("members")
      .insert({ household_id: householdId, name: trimmed })
      .select("id")
      .single();
    if (error || !data) return setError(error?.message ?? "Could not add you.");
    claim(data.id);
  }

  return (
    <section className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm">
      <h2 className="font-semibold">Which one are you?</h2>
      <p className="text-sm text-muted-foreground">
        So we know who to credit when you tap Done.
      </p>
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <button
            key={m.id}
            onClick={() => claim(m.id)}
            className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            {m.name}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Not on the list?</p>
      <div className="flex gap-2">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={addMe}>Add me</Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  );
}