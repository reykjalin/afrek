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
      <TaskFilterProvider>
        <TopNavActionsProvider>
          <AppShell>{children}</AppShell>
        </TopNavActionsProvider>
      </TaskFilterProvider>
    </TaskStateProvider>
  );
}
