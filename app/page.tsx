"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMyHouseholdId } from "@/lib/household";
import { getToday, type TodayItem } from "@/lib/rotation";
import type { Member } from "@/lib/types";
import ChoreCard from "@/components/ChoreCard";
import Loader from "@/components/Loader";
import WhoAmI from "@/components/WhoAmI";

const todayString = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, your local date

export default function Home() {
  const [items, setItems] = useState<TodayItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [myMemberId, setMyMemberId] = useState<string | null>(null);
  const [householdId, setHouseholdId] = useState("");
  const [loading, setLoading] = useState(true);
  const started = useRef(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const hid = await getMyHouseholdId(supabase);
    if (!hid) return;
    setHouseholdId(hid);

    const [m, c, d, me] = await Promise.all([
      supabase.from("members").select("id, name"),
      supabase.from("chores").select("id, name, every_n_days, skipped_on, pinned_to"),
      supabase.from("completions").select("chore_id, member_id, done_on"),
      supabase.from("household_users").select("member_id").limit(1).maybeSingle(),
    ]);
    setMembers(m.data ?? []);
    setMyMemberId(me.data?.member_id ?? null);
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

  async function skip(choreId: string, day: string | null) {
    await createClient().rpc("skip_chore", { p_id: choreId, p_day: day });
    load();
  }

  const active = items.filter((i) => !i.skipped);

  return (
    <main className="mx-auto max-w-md space-y-4 p-4 pb-24">
      <header className="rounded-2xl bg-[linear-gradient(135deg,#4f46e5,#8b5cf6)] p-5 text-white shadow-md">
        <h1 className="text-2xl font-bold">Today 🪐</h1>
        <p className="text-sm opacity-90">
          {loading || active.length === 0
            ? "Rotate. Share. Done."
            : `${active.filter((i) => i.done).length} of ${active.length} done today`}
        </p>
      </header>

      {!loading && !myMemberId && (
        <WhoAmI householdId={householdId} members={members} onClaimed={load} />
      )}

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
          <p className="text-4xl">🪐</p>
          <p className="mt-2 font-semibold">Nothing due today</p>
          <p className="text-sm text-muted-foreground">
            Add your household&apos;s names and chores on the Add tab.
          </p>
        </div>
      ) : (
        items.map((item) => (
          <ChoreCard
            key={item.chore.id}
            item={item}
            meId={myMemberId}
            onDone={() =>
              item.assignee && markDone(item.chore.id, myMemberId ?? item.assignee.id)
            }
            onSkip={() => skip(item.chore.id, todayString())}
            onUndoSkip={() => skip(item.chore.id, null)}
          />
        ))
      )}
    </main>
  );
}