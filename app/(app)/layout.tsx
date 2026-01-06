import { Suspense } from "react";
import { ConvexClientProvider } from "@/lib/convexClient";
import { AppShell } from "@/components/layout/AppShell";
import { TaskFilterProvider } from "@/features/tasks/TaskFilterContext";
import { TaskStateProvider } from "@/features/tasks/TaskStateContext";
import { TopNavActionsProvider } from "@/features/layout/TopNavActionsContext";
import { EncryptionProvider } from "@/features/crypto";

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
              <TopNavActionsProvider>
                <AppShell>{children}</AppShell>
              </TopNavActionsProvider>
            </TaskStateProvider>
          </TaskFilterProvider>
        </EncryptionProvider>
      </Suspense>
    </ConvexClientProvider>
  );
}
