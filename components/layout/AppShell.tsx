"use client";

import { CommandBar, CommandBarTrigger } from "@/components/command-bar";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  useGlobalShortcuts();

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 items-center gap-4 px-4">
          <CommandBarTrigger />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <CommandBar />
    </>
  );
}
