"use client";

import { TaskItem } from "./TaskItem";
import type { Task } from "@/features/tasks/types";

interface TaskListProps {
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  onToggleDone,
  onUpdateTitle,
  onUpdateNotes,
  onSchedule,
  onDelete,
  emptyMessage = "No tasks",
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleDone={onToggleDone}
          onUpdateTitle={onUpdateTitle}
          onUpdateNotes={onUpdateNotes}
          onSchedule={onSchedule}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
