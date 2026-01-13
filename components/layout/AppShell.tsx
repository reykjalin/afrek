"use client";

import { CommandBar, CommandBarTrigger } from "@/components/command-bar";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";
import { EncryptionModalTrigger } from "./EncryptionModalTrigger";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  useGlobalShortcuts();
  const { leftContent, rightContent } = useTopNavActions();

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 items-center gap-4 px-4">
          {/* Left */}
          <div className="flex items-center justify-start shrink-0">
            {leftContent}
          </div>
          
          {/* Center: command bar trigger */}
          <div className="flex-1 flex justify-center min-w-0">
            <CommandBarTrigger />
          </div>
          
          {/* Right */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            {rightContent}
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <CommandBar />
      <EncryptionModalTrigger />
    </>
  );
}
