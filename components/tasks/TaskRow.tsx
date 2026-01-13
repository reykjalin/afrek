"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, Calendar, CalendarPlus } from "lucide-react";
import { format } from "date-fns";
import type { Value } from "platejs";
import { cn } from "@/lib/utils";
import { startViewTransition } from "@/lib/viewTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  TitleEditor,
  textToTitleValue,
} from "@/components/editors/TitleEditor";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTaskAccess } from "@/features/billing";
import {
  parseDateString,
  getTomorrowString,
  toISODateString,
} from "@/lib/date";
import type { Task, TaskPriority } from "@/features/tasks/types";

interface TaskRowProps {
  task: Task;
  isFocused?: boolean;
  onToggleDone: (id: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
  onFocus?: () => void;
}

export function TaskRow({
  task,
  isFocused = false,
  onToggleDone,
  onSchedule,
  onFocus,
}: TaskRowProps) {
  const router = useRouter();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { handleTagToggle } = useTaskFilter();
  const { readOnly } = useTaskAccess();

  const isDone = task.status === "done";

  const titleValue = useMemo<Value>(() => {
    if (task.titleJson) {
      try {
        return JSON.parse(task.titleJson) as Value;
      } catch {
        return textToTitleValue("");
      }
    }
    return textToTitleValue("");
  }, [task.titleJson]);

  const handleRescheduleToTomorrow = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (readOnly) return;
      onSchedule(task.id, getTomorrowString());
    },
    [readOnly, task.id, onSchedule]
  );

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date || readOnly) return;
      onSchedule(task.id, toISODateString(date));
      setIsDatePickerOpen(false);
    },
    [readOnly, task.id, onSchedule]
  );

  const handleRowClick = () => {
    onFocus?.();
    startViewTransition(() => {
      router.push(`/tasks/${task.id}`);
    });
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (readOnly) return;
    onToggleDone(task.id);
  };

  return (
    <div
      onClick={handleRowClick}
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
        isFocused && "ring-2 ring-primary ring-offset-2",
        isDone && "opacity-60"
      )}
    >
      {/* Row 1 on mobile / Main row on desktop */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Checkbox */}
        <button
          onClick={handleCheckboxClick}
          disabled={readOnly}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
            isDone
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary",
            readOnly && "opacity-60 cursor-default"
          )}
        >
          {isDone && <Check className="h-3 w-3" />}
        </button>

        {/* Title - takes up 65-70% on desktop */}
        <div
          className={cn(
            "flex-1 min-w-0 sm:max-w-[70%]",
            isDone && "line-through"
          )}
        >
          <TitleEditor
            value={titleValue}
            onChange={() => {}}
            readOnly
            containerClassName="border-none bg-transparent"
          />
        </div>
      </div>

      {/* Row 2 on mobile: Tags */}
      <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
        {task.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="text-xs cursor-pointer hover:bg-secondary/80"
            onClick={(e) => {
              e.stopPropagation();
              handleTagToggle(tag);
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Row 3 on mobile / End of row on desktop: Quick actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!isDone && (
          <>
            {/* Reschedule to tomorrow */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleRescheduleToTomorrow}
              disabled={readOnly}
              className="h-7 w-7"
              title="Reschedule to tomorrow"
            >
              <CalendarPlus className="h-4 w-4" />
            </Button>

            {/* Reschedule calendar picker */}
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => e.stopPropagation()}
                    disabled={readOnly}
                    className="h-7 w-7"
                    title="Reschedule"
                  />
                }
              >
                <Calendar className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <CalendarComponent
                  mode="single"
                  selected={
                    task.scheduledDate
                      ? parseDateString(task.scheduledDate)
                      : undefined
                  }
                  onSelect={handleDateSelect}
                />
              </PopoverContent>
            </Popover>
          </>
        )}

        {/* Show scheduled/completed date */}
        <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
          {isDone && task.completedAt
            ? format(new Date(task.completedAt), "MMM d")
            : task.scheduledDate
              ? format(parseDateString(task.scheduledDate), "MMM d")
              : "Backlog"}
        </span>
      </div>
    </div>
  );
}
