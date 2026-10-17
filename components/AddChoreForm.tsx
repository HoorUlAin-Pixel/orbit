"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddChoreForm({ householdId }: { householdId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [customDays, setCustomDays] = useState("3");
  const [error, setError] = useState("");

  async function save() {
    if (!name.trim()) return setError("Give the chore a name.");
    const days =
      frequency === "daily" ? 1 : frequency === "weekly" ? 7 : Number(customDays);
    if (!days || days < 1) return setError("Days must be 1 or more.");

    const { error } = await createClient()
      .from("chores")
      .insert({ household_id: householdId, name: name.trim(), every_n_days: days });
    if (error) return setError(error.message);
    router.push("/");
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">New chore</h2>
      <Input
        placeholder="Chore name (e.g. Dishes)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h2 className="text-lg font-semibold">How often?</h2>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
        {["daily", "weekly", "custom"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFrequency(f)}
            className={`rounded-lg py-2 text-sm font-medium capitalize transition ${frequency === f
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button className="w-full" onClick={save}>
        Save chore
      </Button>
    </section>
  );
}