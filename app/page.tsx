"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getToday, type TodayItem } from "@/lib/rotation";
import ChoreCard from "@/components/ChoreCard";

const todayString = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, your local date

export default function Home() {
  const [items, setItems] = useState<TodayItem[]>([]);
  const [householdId, setHouseholdId] = useState("");
  const [loading, setLoading] = useState(true);
  const started = useRef(false);

  const load = useCallback(async () => {
    const supabase = createClient();

    // Find this person's household, or create it the first time
    let { data: household } = await supabase
      .from("households").select("id").limit(1).maybeSingle();
    if (!household) {
      const { data } = await supabase
        .from("households").insert({}).select("id").single();
      household = data;
    }
    if (!household) return;
    setHouseholdId(household.id);

    const [m, c, d] = await Promise.all([
      supabase.from("members").select("id, name"),
      supabase.from("chores").select("id, name, every_n_days"),
      supabase.from("completions").select("chore_id, member_id, done_on"),
    ]);
    setItems(getToday(m.data ?? [], c.data ?? [], d.data ?? [], todayString()));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (started.current) return; // stops a double-run in dev mode
    started.current = true;
    load();
  }, [load]);

  async function markDone(choreId: string, memberId: string) {
    const supabase = createClient();
    await supabase.from("completions").insert({
      household_id: householdId,
      chore_id: choreId,
      member_id: memberId,
      done_on: todayString(),
    });
    load();
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-4 pb-24">
      <header>
        <h1 className="text-2xl font-bold">Today 🪐</h1>
        <p className="text-sm text-muted-foreground">Rotate. Share. Done.</p>
      </header>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">
          Nothing due today. Add members and chores to get started.
        </p>
      ) : (
        items.map((item) => (
          <ChoreCard
            key={item.chore.id}
            item={item}
            onDone={() => item.assignee && markDone(item.chore.id, item.assignee.id)}
          />
        ))
      )}
    </main>
  );
}