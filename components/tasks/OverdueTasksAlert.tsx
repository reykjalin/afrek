"use client";

import { AlertTriangle } from "lucide-react";
import { TaskList } from "./TaskList";
import type { Task, TaskPriority } from "@/features/tasks/types";

interface OverdueTasksAlertProps {
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
  focusedTaskId?: string;
  onTaskFocus?: (id: string) => void;
}

export function OverdueTasksAlert({
  tasks,
  onToggleDone,
  onSchedule,
  onUpdatePriority,
  focusedTaskId,
  onTaskFocus,
}: OverdueTasksAlertProps) {
  // Don't render if no overdue tasks
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
      {/* Header with icon and count */}
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
        <h3 className="font-semibold text-destructive">Overdue Tasks</h3>
        <span className="ml-auto inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-destructive/20 text-sm font-medium text-destructive">
          {tasks.length}
        </span>
      </div>

      {/* Tasks list - reuse existing TaskList component */}
      <TaskList
        tasks={tasks}
        onToggleDone={onToggleDone}
        onSchedule={onSchedule}
        onUpdatePriority={onUpdatePriority}
        focusedTaskId={focusedTaskId}
        onTaskFocus={onTaskFocus}
        emptyMessage="No overdue tasks"
      />
    </div>
  );
}
