import Image from "next/image";

export default function Home() {
  return (
     <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-4xl font-bold">Orbit 🪐</h1>
      <p className="text-muted-foreground">Rotate. Share. Done.</p>
    </main>
  );
}
