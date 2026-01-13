"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, CalendarPlus } from "lucide-react";
import { format } from "date-fns";
import type { Value } from "platejs";
import { cn } from "@/lib/utils";
import { TagPill } from "@/components/ui/tag-pill";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  TitleEditor,
  textToTitleValue,
} from "@/components/editors/TitleEditor";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTaskAccess } from "@/features/billing";
import {
  parseDateString,
  toISODateString,
} from "@/lib/date";
import { startViewTransition } from "@/lib/viewTransition";
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

  const handleRescheduleToNextDay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (readOnly) return;
      // Move to next day from current scheduled date (not tomorrow from today)
      const currentDate = task.scheduledDate ? parseDateString(task.scheduledDate) : new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      onSchedule(task.id, toISODateString(currentDate));
    },
    [readOnly, task.id, task.scheduledDate, onSchedule]
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
        "group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors hover:bg-muted/50",
        "mx-auto w-full max-w-4xl",
        isFocused && "ring-2 ring-primary ring-offset-1",
        isDone && "opacity-60"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleCheckboxClick}
        disabled={readOnly}
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
          isDone
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary",
          readOnly && "opacity-60 cursor-default"
        )}
      >
        {isDone && <Check className="h-2.5 w-2.5" />}
      </button>

      {/* Title */}
      <div
        className={cn(
          "flex-1 min-w-0 truncate text-sm",
          isDone && "line-through text-muted-foreground"
        )}
      >
        <TitleEditor
          value={titleValue}
          onChange={() => {}}
          readOnly
          containerClassName="border-none bg-transparent [&_p]:my-0"
        />
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex items-center gap-1 shrink-0">
          {task.tags.map((tag) => (
            <TagPill
              key={tag}
              tag={tag}
              onClick={() => handleTagToggle(tag)}
            />
          ))}
        </div>
      )}

      {/* Quick actions + Date */}
      <div className="flex items-center gap-0.5 shrink-0">
        {!isDone && (
          <Tooltip>
            <TooltipTrigger
              onClick={handleRescheduleToNextDay}
              disabled={readOnly}
              render={<Button variant="ghost" size="icon-sm" className="h-6 w-6" />}
            >
              <CalendarPlus className="h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent>Move to next day</TooltipContent>
          </Tooltip>
        )}

        {/* Date - clicking opens calendar picker */}
        {!isDone ? (
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger
              onClick={(e) => e.stopPropagation()}
              disabled={readOnly}
              className={cn(
                "text-xs whitespace-nowrap px-1.5 py-0.5 rounded",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "transition-colors cursor-pointer",
                readOnly && "opacity-60 cursor-default"
              )}
            >
              {task.scheduledDate
                ? format(parseDateString(task.scheduledDate), "MMM d")
                : "Backlog"}
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
        ) : (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {task.completedAt
              ? format(new Date(task.completedAt), "MMM d")
              : "Done"}
          </span>
        )}
      </div>
    </div>
  );
}
