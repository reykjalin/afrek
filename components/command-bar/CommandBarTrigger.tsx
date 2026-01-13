"use client";

import { Search } from "lucide-react";
import { useCommandBar } from "@/features/command-bar";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { startViewTransition } from "@/lib/viewTransition";

export function CommandBarTrigger() {
  const { openCommandBar, open } = useCommandBar();

  const handleClick = () => {
    startViewTransition(() => {
      openCommandBar();
    });
  };

  return (
    <button
      onClick={handleClick}
      style={{ viewTransitionName: "command-bar" }}
      className={cn(
        "mx-auto w-full max-w-[500px]",
        "flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-all duration-150 shadow-sm",
        open
          ? "opacity-0 scale-95 pointer-events-none"
          : "opacity-100 scale-100"
      )}
    >
      <Search className="h-4 w-4" />
      <span className="flex-1 text-left truncate">Search or type a command...</span>
      <Kbd>⌘K</Kbd>
    </button>
  );
}
