"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Member } from "@/lib/types";
import AddChoreForm from "@/components/AddChoreForm";
import MemberList from "@/components/MemberList";

export default function AddPage() {
  const [householdId, setHouseholdId] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const started = useRef(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: household } = await supabase
      .from("households").select("id").limit(1).maybeSingle();
    if (!household) return;
    setHouseholdId(household.id);
    const { data } = await supabase.from("members").select("id, name").order("name");
    setMembers(data ?? []);
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    load();
  }, [load]);

  if (!householdId) return <p className="p-4 text-muted-foreground">Loading…</p>;

  return (
    <main className="mx-auto max-w-md space-y-8 p-4 pb-24">
      <h1 className="text-2xl font-bold">Add 🪐</h1>
      <MemberList householdId={householdId} members={members} onChange={load} />
      {members.length === 0 ? (
        <p className="text-muted-foreground">Add at least one name above, then add chores.</p>
      ) : (
        <AddChoreForm householdId={householdId} />
      )}
    </main>
  );
}