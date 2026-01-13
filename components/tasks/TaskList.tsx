"use client";

import { TaskItem } from "./TaskItem";
import type { Task, TaskPriority } from "@/features/tasks/types";

interface TaskListProps {
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
  emptyMessage?: string;
  focusedTaskId?: string;
  onTaskFocus?: (id: string) => void;
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  Highest: 0,
  High: 1,
  Medium: 2,
  Normal: 3,
  Low: 4,
  Lowest: 5,
};

export function TaskList({
  tasks,
  onToggleDone,
  onSchedule,
  onUpdatePriority,
  emptyMessage = "No tasks",
  focusedTaskId,
  onTaskFocus,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });

  return (
    <div className="space-y-1">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isFocused={focusedTaskId === task.id}
          onToggleDone={onToggleDone}
          onSchedule={onSchedule}
          onUpdatePriority={onUpdatePriority}
          onFocus={() => onTaskFocus?.(task.id)}
        />
      ))}
    </div>
  );
}
