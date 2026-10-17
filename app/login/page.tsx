"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(mode: "in" | "up") {
    const supabase = createClient();
    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    if (error) return setError(error.message);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 p-6">
      <h1 className="text-3xl font-bold">Orbit 🪐</h1>
      <p className="text-muted-foreground">Rotate. Share. Done.</p>
      <Input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password (6+ characters)" value={password}
        onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button onClick={() => submit("in")}>Sign in</Button>
      <Button variant="outline" onClick={() => submit("up")}>Create account</Button>
    </main>
  );
}