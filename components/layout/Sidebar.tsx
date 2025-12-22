"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Settings, Archive, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/backlog", label: "Backlog", icon: Archive },
  { href: "/completed", label: "Completed", icon: CheckCircle2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r bg-muted/30">
      <div className="p-4">
        <Link href="/" className="text-xl font-bold">
          Afrek
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
