"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TaskRow } from "./TaskRow";
import { cn } from "@/lib/utils";
import { toISODateString, getTodayString, getWeekNumber, formatWeekRange } from "@/lib/date";
import { useTaskFocus } from "@/features/tasks/TaskFocusContext";
import type { Task, TaskPriority } from "@/features/tasks/types";

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  Highest: 0,
  High: 1,
  Medium: 2,
  Normal: 3,
  Low: 4,
  Lowest: 5,
};

interface WeeklyViewProps {
  tasks: Task[];
  weekStart: Date;
  onWeekChange: (weekStart: Date) => void;
  onToggleDone: (id: string) => void;
  onUpdateTitle: (id: string, titleJson: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  onSchedule: (id: string, date: string | null) => void;
  onDelete: (id: string) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
  isCreatingTask?: boolean;
  newTaskTitle?: string;
  onNewTaskTitleChange?: (title: string) => void;
  onCreateTask?: () => void;
  onCancelCreate?: () => void;
}

function getWeekDays(startMonday: Date): { label: string; date: string; isToday: boolean }[] {
  const days: { label: string; date: string; isToday: boolean }[] = [];
  const todayStr = getTodayString();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startMonday);
    date.setDate(startMonday.getDate() + i);
    const dateStr = toISODateString(date);
    const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
    const monthLabel = monthNames[date.getMonth()];
    const dateLabel = date.getDate().toString();

    days.push({
      label: `${dayLabel} ${monthLabel} ${dateLabel}`,
      date: dateStr,
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

export function WeeklyView({
  tasks,
  weekStart,
  onWeekChange,
  onToggleDone,
  onSchedule,
  onUpdatePriority,
  isCreatingTask,
  newTaskTitle,
  onNewTaskTitleChange,
  onCreateTask,
  onCancelCreate,
}: WeeklyViewProps) {
  const weekDays = getWeekDays(weekStart);
  const { focusedTaskId, setFocusedTaskId } = useTaskFocus();

  const goToPreviousWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    onWeekChange(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    onWeekChange(next);
  };

  const getTasksForDay = (date: string) => {
    return tasks
      .filter((task) => task.scheduledDate === date)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  };

  return (
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

      <div className="flex flex-col gap-6">
        {weekDays.map(({ label, date, isToday }) => {
          const dayTasks = getTasksForDay(date);
          return (
            <div key={date}>
              <div
                className={cn(
                  "mb-2 border-b pb-1 text-sm font-semibold",
                  isToday ? "border-primary text-primary" : "border-border text-muted-foreground"
                )}
              >
                {label}
              </div>
              {dayTasks.length > 0 ? (
                <div className="space-y-1">
                  {dayTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      isFocused={focusedTaskId === task.id}
                      onToggleDone={onToggleDone}
                      onSchedule={onSchedule}
                      onUpdatePriority={onUpdatePriority}
                      onFocus={() => setFocusedTaskId(task.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/50 italic">No tasks</p>
              )}
              {isToday && isCreatingTask && (
                <div className="mt-2">
                  <Input
                    autoFocus
                    placeholder="Task title..."
                    value={newTaskTitle}
                    onChange={(e) => onNewTaskTitleChange?.(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onCreateTask?.();
                      if (e.key === "Escape") onCancelCreate?.();
                    }}
                    onBlur={() => {
                      if (!newTaskTitle?.trim()) onCancelCreate?.();
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
