"use client";

import { useTopNavActions } from "@/features/layout/TopNavActionsContext";

export function TopNav() {
  const { leftContent } = useTopNavActions();

  return (
    <header className="flex h-14 items-center justify-between px-4">
      <div className="flex items-center gap-2">{leftContent}</div>
    </header>
  );
}
