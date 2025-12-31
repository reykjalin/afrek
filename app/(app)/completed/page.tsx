"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TaskList } from "@/components/tasks/TaskList";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { getStartOfWeek, getWeekNumber, formatWeekRange } from "@/lib/date";
import type { Task, TaskPriority } from "@/features/tasks/types";

export default function CompletedPage() {
  const { tasks, updateTask, deleteTask, toggleTaskDone } = useTaskState();
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));

  const completedTasks = useMemo(() => {
    return tasks
      .filter((task): task is Task & { completedAt: number } => 
        task.status === "done" && task.completedAt !== undefined
      )
      .sort((a, b) => b.completedAt - a.completedAt);
  }, [tasks]);

  const tasksForSelectedWeek = useMemo(() => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    return completedTasks.filter((task) => {
      const completedDate = new Date(task.completedAt);
      const taskWeekStart = getStartOfWeek(completedDate);
      return taskWeekStart.toDateString() === weekStart.toDateString();
    });
  }, [completedTasks, weekStart]);

  const goToPreviousWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

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
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-1">
            <Button variant="outline" size="icon-sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Tooltip>
              <TooltipTrigger>
                <h2 className="text-lg font-semibold w-[160px] text-center">
                  Week {getWeekNumber(weekStart)}
                </h2>
              </TooltipTrigger>
              <TooltipContent>{formatWeekRange(weekStart)}</TooltipContent>
            </Tooltip>
            <Button variant="outline" size="icon-sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <TaskList
            tasks={tasksForSelectedWeek}
            onToggleDone={handleToggleDone}
            onUpdateTitle={handleUpdateTitle}
            onUpdateNotes={handleUpdateNotes}
            onUpdateTags={handleUpdateTags}
            onSchedule={handleSchedule}
            onDelete={handleDelete}
            onUpdatePriority={handleUpdatePriority}
            emptyMessage="No completed tasks this week"
          />
        </div>
      </div>
    </div>
  );
}
