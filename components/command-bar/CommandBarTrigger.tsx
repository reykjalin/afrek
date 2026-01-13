"use client";

import { Search } from "lucide-react";
import { useCommandBar } from "@/features/command-bar";
import { Kbd } from "@/components/ui/kbd";

export function CommandBarTrigger() {
  const { openCommandBar } = useCommandBar();

  return (
    <button
      onClick={openCommandBar}
      className="flex flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <Search className="h-4 w-4" />
      <span className="flex-1 text-left">Search or type a command...</span>
      <Kbd>⌘K</Kbd>
    </button>
  );
}
