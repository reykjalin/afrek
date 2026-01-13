import { Suspense } from "react";
import { ConvexClientProvider } from "@/lib/convexClient";
import { AppShell } from "@/components/layout/AppShell";
import { TaskFilterProvider } from "@/features/tasks/TaskFilterContext";
import { TaskStateProvider } from "@/features/tasks/TaskStateContext";
import { TaskFocusProvider } from "@/features/tasks/TaskFocusContext";
import { TopNavActionsProvider } from "@/features/layout/TopNavActionsContext";
import { EncryptionProvider } from "@/features/crypto";
import { CommandBarProvider } from "@/features/command-bar";
import { KeyboardProvider } from "@/features/keyboard";

export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <Suspense fallback={null}>
        <EncryptionProvider>
          <TaskFilterProvider>
            <TaskStateProvider>
              <TaskFocusProvider>
                <KeyboardProvider>
                  <CommandBarProvider>
                    <TopNavActionsProvider>
                      <AppShell>{children}</AppShell>
                    </TopNavActionsProvider>
                  </CommandBarProvider>
                </KeyboardProvider>
              </TaskFocusProvider>
            </TaskStateProvider>
          </TaskFilterProvider>
        </EncryptionProvider>
      </Suspense>
    </ConvexClientProvider>
  );
}
