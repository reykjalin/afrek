import { Suspense } from "react";
import { ConvexClientProvider } from "@/lib/convexClient";
import { AppShell } from "@/components/layout/AppShell";
import { TaskFilterProvider } from "@/features/tasks/TaskFilterContext";
import { TaskStateProvider } from "@/features/tasks/TaskStateContext";
import { TopNavActionsProvider } from "@/features/layout/TopNavActionsContext";

export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <TaskStateProvider>
        <Suspense fallback={null}>
          <TaskFilterProvider>
            <TopNavActionsProvider>
              <AppShell>{children}</AppShell>
            </TopNavActionsProvider>
          </TaskFilterProvider>
        </Suspense>
      </TaskStateProvider>
    </ConvexClientProvider>
  );
}
