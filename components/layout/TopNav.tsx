"use client";

import { UserButton } from "@clerk/nextjs";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";

export function TopNav() {
  const { leftContent } = useTopNavActions();

  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex items-center gap-2">{leftContent}</div>
      <div className="flex items-center gap-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
