"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskList } from "./TaskList";
import { cn } from "@/lib/utils";
import { toISODateString, getStartOfWeek, getTodayString } from "@/lib/date";
import type { Task, TaskPriority } from "@/features/tasks/types";

interface WeeklyViewProps {
  tasks: Task[];
  weekStart: Date;
  onWeekChange: (weekStart: Date) => void;
  onToggleDone: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onDelete: (id: string) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
}

function getWeekDays(startMonday: Date): { label: string; date: string; isToday: boolean }[] {
  const days: { label: string; date: string; isToday: boolean }[] = [];
  const todayStr = getTodayString();

  for (let i = 0; i < 7; i++) {
    const date = new Date(startMonday);
    date.setDate(startMonday.getDate() + i);
    const dateStr = toISODateString(date);
    const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateLabel = date.getDate().toString();

    days.push({
      label: `${dayLabel} ${dateLabel}`,
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
  onUpdateTitle,
  onUpdateNotes,
  onSchedule,
  onDelete,
  onUpdatePriority,
}: WeeklyViewProps) {
  const weekDays = getWeekDays(weekStart);

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

  const goToCurrentWeek = () => {
    onWeekChange(getStartOfWeek(new Date()));
  };

  const isCurrentWeek = () => {
    const currentWeekStart = getStartOfWeek(new Date());
    return weekStart.toDateString() === currentWeekStart.toDateString();
  };

  const formatWeekRange = () => {
    const endOfWeek = new Date(weekStart);
    endOfWeek.setDate(weekStart.getDate() + 6);
    const startMonth = weekStart.toLocaleDateString("en-US", { month: "short" });
    const endMonth = endOfWeek.toLocaleDateString("en-US", { month: "short" });

    if (startMonth === endMonth) {
      return `${startMonth} ${weekStart.getDate()} - ${endOfWeek.getDate()}`;
    }
    return `${startMonth} ${weekStart.getDate()} - ${endMonth} ${endOfWeek.getDate()}`;
  };

  const getTasksForDay = (date: string) => {
    return tasks.filter((task) => task.scheduledDate === date);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon-sm" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold min-w-fit">{formatWeekRange()}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {!isCurrentWeek() && (
            <Button onClick={goToCurrentWeek}>
              Go to current week
            </Button>
          )}
        </div>
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
                <TaskList
                  tasks={dayTasks}
                  onToggleDone={onToggleDone}
                  onUpdateTitle={onUpdateTitle}
                  onUpdateNotes={onUpdateNotes}
                  onSchedule={onSchedule}
                  onDelete={onDelete}
                  onUpdatePriority={onUpdatePriority}
                />
              ) : (
                <p className="text-sm text-muted-foreground/50 italic">No tasks</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
