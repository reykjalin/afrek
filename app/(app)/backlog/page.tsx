"use client";

import { useMemo } from "react";
import { Inbox } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import type { TaskPriority } from "@/features/tasks/types";

export default function BacklogPage() {
  const { tasks, updateTask, deleteTask, toggleTaskDone } = useTaskState();

  const backlogTasks = useMemo(() => {
    return tasks.filter((task) => task.status === "backlog");
  }, [tasks]);

  const handleToggleDone = (id: string) => toggleTaskDone(id);

  const handleUpdateTitle = (id: string, title: string) => {
    updateTask(id, { title });
  };

  const handleUpdateNotes = (id: string, notesMarkdown: string) => {
    updateTask(id, { notesMarkdown });
  };

  const handleUpdateTags = (id: string, tags: string[]) => {
    updateTask(id, { tags });
  };

  const handleSchedule = (id: string, date: string | null) => {
    updateTask(id, {
      scheduledDate: date ?? undefined,
      status: date ? "scheduled" : "backlog",
    });
  };

  const handleDelete = (id: string) => deleteTask(id);

  const handleUpdatePriority = (id: string, priority: TaskPriority) => {
    updateTask(id, { priority });
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Inbox className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Backlog</h1>
        </div>
        <TaskList
          tasks={backlogTasks}
          onToggleDone={handleToggleDone}
          onUpdateTitle={handleUpdateTitle}
          onUpdateNotes={handleUpdateNotes}
          onUpdateTags={handleUpdateTags}
          onSchedule={handleSchedule}
          onDelete={handleDelete}
          onUpdatePriority={handleUpdatePriority}
          emptyMessage="No tasks in backlog"
        />
      </div>
    </div>
  );
}
