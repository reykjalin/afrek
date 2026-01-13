"use client";

import { CommandBar, CommandBarTrigger } from "@/components/command-bar";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  useGlobalShortcuts();
  const { leftContent, rightContent } = useTopNavActions();

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
          {/* Left */}
          <div className="flex items-center justify-start">
            {leftContent}
          </div>
          
          {/* Center: command bar trigger */}
          <CommandBarTrigger />
          
          {/* Right */}
          <div className="flex items-center justify-end gap-2">
            {rightContent}
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <CommandBar />
    </>
  );
}
