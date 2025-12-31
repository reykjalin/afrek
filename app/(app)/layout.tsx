import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TaskFilterProvider } from "@/features/tasks/TaskFilterContext";
import { TaskStateProvider } from "@/features/tasks/TaskStateContext";
import { TopNavActionsProvider } from "@/features/layout/TopNavActionsContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TaskStateProvider>
      <Suspense fallback={null}>
        <TaskFilterProvider>
          <TopNavActionsProvider>
            <AppShell>{children}</AppShell>
          </TopNavActionsProvider>
        </TaskFilterProvider>
      </Suspense>
    </TaskStateProvider>
  );
}
