"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Member } from "@/lib/types";
import AddChoreForm from "@/components/AddChoreForm";
import MemberList from "@/components/MemberList";
import Loader from "@/components/Loader";
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

  if (!householdId) return <Loader />;

  return (
    <main className="mx-auto max-w-md space-y-8 p-4 pb-24">
      <header className="rounded-2xl bg-[linear-gradient(135deg,#4f46e5,#8b5cf6)] p-5 text-white shadow-md">
        <h1 className="text-2xl font-bold">Add 🪐</h1>
        <p className="text-sm opacity-90">Names and chores</p>
      </header>
      <MemberList householdId={householdId} members={members} onChange={load} />
      {members.length === 0 ? (
        <p className="text-muted-foreground">Add at least one name above, then add chores.</p>
      ) : (
        <AddChoreForm householdId={householdId} />
      )}
    </main>
  );
}