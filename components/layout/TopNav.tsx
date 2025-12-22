"use client";

import { Button } from "@/components/ui/button";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";

export function TopNav() {
  const { leftContent } = useTopNavActions();

  return (
    <header className="flex h-14 items-center justify-between px-4">
      <div className="flex items-center gap-2">{leftContent}</div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Upgrade
        </Button>
        <div className="h-8 w-8 rounded-full bg-muted" title="User avatar" />
      </div>
    </header>
  );
}
