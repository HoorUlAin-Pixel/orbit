"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";

type Entry = { id: string; done_on: string; chore: string; member: string };

const dayLabel = (day: string) =>
  new Date(day + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      const supabase = createClient();
      const start = new Date();
      start.setDate(start.getDate() - 6); // today + the 6 days before
      const since = start.toLocaleDateString("en-CA");

      const [m, c, done] = await Promise.all([
        supabase.from("members").select("id, name"),
        supabase.from("chores").select("id, name"),
        supabase
          .from("completions")
          .select("id, chore_id, member_id, done_on")
          .gte("done_on", since)
          .order("done_on", { ascending: false }),
      ]);

      const memberName = new Map((m.data ?? []).map((x) => [x.id, x.name]));
      const choreName = new Map((c.data ?? []).map((x) => [x.id, x.name]));

      setEntries(
        (done.data ?? []).map((x) => ({
          id: x.id,
          done_on: x.done_on,
          chore: choreName.get(x.chore_id) ?? "Deleted chore",
          member: memberName.get(x.member_id) ?? "Someone",
        }))
      );
      setLoading(false);
    })();
  }, []);

  const days = [...new Set(entries.map((e) => e.done_on))];
  const counts = new Map<string, number>();
  entries.forEach((e) => counts.set(e.member, (counts.get(e.member) ?? 0) + 1));

  return (
    <main className="mx-auto max-w-md space-y-4 p-4 pb-24">
      <header>
        <h1 className="text-2xl font-bold">This week 🪐</h1>
        <p className="text-sm text-muted-foreground">The last 7 days</p>
      </header>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-muted-foreground">
          Nothing completed yet. Tap Done on a chore and it will show up here.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {[...counts].map(([name, n]) => (
              <span key={name} className="rounded-full bg-muted px-3 py-1 text-sm">
                {name}: {n}
              </span>
            ))}
          </div>

          {days.map((day) => (
            <section key={day} className="space-y-2">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {dayLabel(day)}
              </h2>
              {entries
                .filter((e) => e.done_on === day)
                .map((e) => (
                  <Card key={e.id} className="flex-row items-center justify-between p-3">
                    <span>✅ {e.chore}</span>
                    <span className="text-sm text-muted-foreground">{e.member}</span>
                  </Card>
                ))}
            </section>
          ))}
        </>
      )}
    </main>
  );
}