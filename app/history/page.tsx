"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";
import Loader from "@/components/Loader";
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
      <header className="rounded-2xl bg-[linear-gradient(135deg,#4f46e5,#8b5cf6)] p-5 text-white shadow-md">
        <h1 className="text-2xl font-bold">This week 🪐</h1>
        <p className="text-sm opacity-90">The last 7 days</p>
      </header>

      {loading ? (
        <Loader />
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
          <p className="text-4xl">📅</p>
          <p className="mt-2 font-semibold">Nothing completed yet</p>
          <p className="text-sm text-muted-foreground">
            Tap Done on a chore and it will show up here.
          </p>
        </div>
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
                    <span className="flex items-center gap-2">
                      <CircleCheck className="size-4 text-green-500" />
                      {e.chore}
                    </span>
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