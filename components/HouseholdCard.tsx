"use client";
import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HouseholdCard({ householdId }: { householdId: string }) {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    createClient()
      .from("households")
      .select("join_code")
      .eq("id", householdId)
      .maybeSingle()
      .then(({ data }) => setCode(data?.join_code ?? ""));
  }, [householdId]);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function join() {
    if (!joinCode.trim()) return;
    if (!window.confirm("Joining moves you out of your current household. Continue?")) return;
    const { error } = await createClient().rpc("join_household", { p_code: joinCode });
    if (error) return setError(error.message);
    window.location.href = "/"; // full reload so every screen picks up the new household
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Invite someone</h2>
      <p className="text-sm text-muted-foreground">
        Share this code. They sign up, then enter it under &quot;Have a code?&quot; below.
      </p>
      <div className="flex items-center justify-between rounded-xl border bg-card p-4">
        <span className="font-mono text-xl font-bold tracking-widest">{code || "…"}</span>
        <Button variant="outline" size="sm" onClick={copy} disabled={!code}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <p className="pt-2 text-sm font-medium">Have a code? Join a household</p>
      <div className="flex gap-2">
        <Input
          placeholder="Enter code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="uppercase"
        />
        <Button onClick={join}>Join</Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  );
}