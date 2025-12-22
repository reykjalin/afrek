"use client";

import { Inbox } from "lucide-react";
import { TaskList } from "./TaskList";
import type { Task, TaskPriority } from "@/features/tasks/types";

interface BacklogViewProps {
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onDelete: (id: string) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
}

export function BacklogView({
  tasks,
  onToggleDone,
  onUpdateTitle,
  onUpdateNotes,
  onSchedule,
  onDelete,
  onUpdatePriority,
}: BacklogViewProps) {
  const backlogTasks = tasks.filter((task) => task.status === "backlog");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Inbox className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Backlog</h2>
        <span className="text-sm text-muted-foreground">
          ({backlogTasks.length} tasks)
        </span>
      </div>

      <TaskList
        tasks={backlogTasks}
        onToggleDone={onToggleDone}
        onUpdateTitle={onUpdateTitle}
        onUpdateNotes={onUpdateNotes}
        onSchedule={onSchedule}
        onDelete={onDelete}
        onUpdatePriority={onUpdatePriority}
        emptyMessage="No tasks in backlog. Add tasks or move scheduled tasks here."
      />
    </div>
  );
}
