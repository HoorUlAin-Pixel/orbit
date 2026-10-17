"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/add", label: "Add", icon: "➕" },
  { href: "/history", label: "History", icon: "📅" },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/login")) return null; // no tabs on the login page

  return (
    <nav className="fixed inset-x-0 bottom-0 border-t bg-background">
      <div className="mx-auto flex max-w-md">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center py-3 text-xs ${
              pathname === t.href
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}