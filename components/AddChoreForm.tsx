"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Chore, Member } from "@/lib/types";

const startFrequency = (c?: Chore) =>
  !c ? "daily" : c.every_n_days === 1 ? "daily" : c.every_n_days === 7 ? "weekly" : "custom";

export default function AddChoreForm({
  householdId,
  members,
  chore,
  onSaved,
  onCancel,
}: {
  householdId: string;
  members: Member[];
  chore?: Chore; // if given, we're editing
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(chore?.name ?? "");
  const [frequency, setFrequency] = useState(startFrequency(chore));
  const [customDays, setCustomDays] = useState(String(chore?.every_n_days ?? 3));
  const [pinnedTo, setPinnedTo] = useState(chore?.pinned_to ?? "");
  const [error, setError] = useState("");

  async function save() {
    if (!name.trim()) return setError("Give the chore a name.");
    const days =
      frequency === "daily" ? 1 : frequency === "weekly" ? 7 : Number(customDays);
    if (!days || days < 1) return setError("Days must be 1 or more.");
    const pinned = pinnedTo || null;

    const supabase = createClient();
    const result = chore
      ? await supabase.rpc("update_chore", {
          p_id: chore.id,
          p_name: name.trim(),
          p_days: days,
          p_pinned: pinned,
        })
      : await supabase.from("chores").insert({
          household_id: householdId,
          name: name.trim(),
          every_n_days: days,
          pinned_to: pinned,
        });
    if (result.error) return setError(result.error.message);

    if (chore) onSaved?.();
    else router.push("/");
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{chore ? "Edit chore" : "New chore"}</h2>
      <Input
        placeholder="Chore name (e.g. Dishes)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p className="text-sm font-medium">How often?</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
        {["daily", "weekly", "custom"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFrequency(f)}
            className={`rounded-lg py-2 text-sm font-medium capitalize transition ${
              frequency === f
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {frequency === "custom" && (
        <div className="flex items-center gap-2 text-sm">
          Every
          <Input
            type="number"
            min={1}
            className="w-20"
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
          />
          days
        </div>
      )}

      <p className="text-sm font-medium">Who does it?</p>
      <div className="flex flex-wrap gap-2">
        {[{ id: "", name: "Take turns" }, ...members].map((m) => (
          <button
            key={m.id || "turns"}
            type="button"
            onClick={() => setPinnedTo(m.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              pinnedTo === m.id
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button className="w-full" onClick={save}>
        {chore ? "Save changes" : "Save chore"}
      </Button>
      {onCancel && (
        <Button variant="ghost" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </section>
  );
}