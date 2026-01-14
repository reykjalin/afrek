"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, CalendarArrowDown } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  TitleEditorStatic,
  textToTitleValue,
} from "@/components/editors/TitleEditor";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTaskAccess } from "@/features/billing";
import { parseDateString, toISODateString } from "@/lib/date";
import { startViewTransition } from "@/lib/viewTransition";
import type { Task, TaskPriority } from "@/features/tasks/types";

interface TaskItemProps {
  task: Task;
  isFocused?: boolean;
  onToggleDone: (id: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
  onFocus?: () => void;
}

export function TaskItem({
  task,
  isFocused = false,
  onToggleDone,
  onSchedule,
  onUpdatePriority,
  onFocus,
}: TaskItemProps) {
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
      const currentDate = task.scheduledDate
        ? parseDateString(task.scheduledDate)
        : new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      onSchedule(task.id, toISODateString(currentDate));
    },
    [readOnly, task.id, task.scheduledDate, onSchedule],
  );

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date || readOnly) return;
      onSchedule(task.id, toISODateString(date));
      setIsDatePickerOpen(false);
    },
    [readOnly, task.id, onSchedule],
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
        "group flex flex-col gap-1.5 px-2 py-2 rounded cursor-pointer transition-colors hover:bg-muted/50",
        "sm:flex-row sm:items-center sm:gap-2 sm:py-1.5",
        "mx-auto w-full max-w-4xl",
        isFocused && "ring-2 ring-primary ring-offset-1",
        isDone && "opacity-60",
      )}
    >
      {/* Row 1: Checkbox + Title */}
      <div className="flex items-center gap-2 sm:flex-1 sm:min-w-0">
        <button
          onClick={handleCheckboxClick}
          disabled={readOnly}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
            isDone
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary",
            readOnly && "opacity-60 cursor-default",
          )}
        >
          {isDone && <Check className="h-2.5 w-2.5" />}
        </button>

        <div
          className={cn(
            "flex-1 min-w-0 text-sm",
            isDone && "line-through text-muted-foreground",
          )}
        >
          <TitleEditorStatic
            value={titleValue}
            containerClassName="border-none bg-transparent [&_p]:my-0"
          />
        </div>
      </div>

      {/* Row 2: Tags + Priority */}
      <div
        className="flex flex-wrap items-center gap-1 pl-6 sm:pl-0 sm:shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {task.tags.map((tag) => (
          <TagPill key={tag} tag={tag} onClick={() => handleTagToggle(tag)} />
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => {
              e.stopPropagation();
              if (readOnly) e.preventDefault();
            }}
            disabled={readOnly}
            className={cn(
              "text-xs whitespace-nowrap px-2 py-1 rounded-md",
              "border border-border bg-background",
              "text-muted-foreground hover:text-foreground hover:bg-muted hover:border-muted-foreground/50",
              "transition-colors cursor-pointer",
              readOnly && "opacity-60 cursor-default",
            )}
          >
            {task.priority}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-32"
            onClick={(e) => e.stopPropagation()}
          >
            {(
              [
                "Highest",
                "High",
                "Medium",
                "Normal",
                "Low",
                "Lowest",
              ] as TaskPriority[]
            ).map((priority) => (
              <DropdownMenuItem
                key={priority}
                onClick={() => onUpdatePriority(task.id, priority)}
                className="cursor-pointer"
              >
                {priority}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Row 3: Scheduling actions */}
      <div
        className="flex items-center gap-0.5 pl-6 sm:pl-0 sm:shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {!isDone && (
          <Tooltip>
            <TooltipTrigger
              onClick={handleRescheduleToNextDay}
              disabled={readOnly}
              render={
                <Button variant="outline" size="icon-sm" className="h-6 w-6" />
              }
            >
              <CalendarArrowDown className="h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent>Move to next day</TooltipContent>
          </Tooltip>
        )}

        {!isDone ? (
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger
              onClick={(e) => e.stopPropagation()}
              disabled={readOnly}
              className={cn(
                "text-xs whitespace-nowrap px-2 py-1 rounded-md",
                "border border-border bg-background",
                "text-muted-foreground hover:text-foreground hover:bg-muted hover:border-muted-foreground/50",
                "transition-colors cursor-pointer",
                readOnly && "opacity-60 cursor-default",
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
