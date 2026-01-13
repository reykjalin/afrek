"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TaskList } from "@/components/tasks/TaskList";
import { UpgradeCTA } from "@/components/UpgradeCTA";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { TaskAccessProvider, useTaskAccess } from "@/features/billing";
import { getStartOfWeek, getWeekNumber, formatWeekRange } from "@/lib/date";
import type { Task, TaskPriority } from "@/features/tasks/types";

function CompletedPageContent() {
  const { tasks, updateTask, deleteTask, toggleTaskDone } = useTaskState();
  const { readOnly, isLoading: isAccessLoading } = useTaskAccess();
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));

  const completedTasks = useMemo(() => {
    return tasks
      .filter((task): task is Task & { completedAt: number } => 
        task.status === "done" && task.completedAt !== undefined
      )
      .sort((a, b) => b.completedAt - a.completedAt);
  }, [tasks]);

  const tasksForSelectedWeek = useMemo(() => {
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

  const handleSchedule = (id: string, date: string | null) => {
    updateTask(id, {
      scheduledDate: date ?? undefined,
      status: date ? "scheduled" : "backlog",
    });
  };

  const handleUpdatePriority = (id: string, priority: TaskPriority) => {
    updateTask(id, { priority });
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-4">
          {!isAccessLoading && readOnly && <UpgradeCTA />}
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
            onSchedule={handleSchedule}
            onUpdatePriority={handleUpdatePriority}
            emptyMessage="No completed tasks this week"
          />
        </div>
      </div>
    </div>
  );
}

export default function CompletedPage() {
  return (
    <TaskAccessProvider>
      <CompletedPageContent />
    </TaskAccessProvider>
  );
}
