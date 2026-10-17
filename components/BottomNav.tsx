"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, CirclePlus, House } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", Icon: House },
  { href: "/add", label: "Add", Icon: CirclePlus },
  { href: "/history", label: "History", Icon: CalendarCheck },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/login")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-md px-2 py-2">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 text-xs ${
                active ? "font-semibold text-primary" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-full ${
                  active ? "bg-primary/10" : ""
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}