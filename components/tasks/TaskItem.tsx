"use client";

import { useState } from "react";
import { Check, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { TaskItemExpanded } from "./TaskItemExpanded";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { toISODateString, parseDateString } from "@/lib/date";
import type { Task, TaskPriority } from "@/features/tasks/types";

interface TaskItemProps {
  task: Task;
  onToggleDone: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  onSchedule: (id: string, date: string | null) => void;
  onDelete: (id: string) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
}

export function TaskItem({
  task,
  onToggleDone,
  onUpdateTitle,
  onUpdateNotes,
  onUpdateTags,
  onSchedule,
  onDelete,
  onUpdatePriority,
}: TaskItemProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { handleTagToggle, selectedTags } = useTaskFilter();
  const { expandedTaskIds, toggleTaskExpanded } = useTaskState();
  const isExpanded = expandedTaskIds.has(task.id);

  const isDone = task.status === "done";

  const handleTitleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdateTitle(task.id, editedTitle.trim());
    } else {
      setEditedTitle(task.title);
    }
    setIsEditingTitle(false);
  };

  const formatScheduledDate = (date?: string) => {
    if (!date) return "Backlog";
    const d = parseDateString(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatCompletedDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const toggleExpanded = () => toggleTaskExpanded(task.id);

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={toggleExpanded}
      className={cn(
        "rounded-lg border bg-card transition-colors",
        isDone && "opacity-60"
      )}
    >
      <div
        className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
        onClick={toggleExpanded}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isExpanded && "rotate-90"
          )}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone(task.id);
          }}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
            isDone
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary"
          )}
        >
          {isDone && <Check className="h-3 w-3" />}
        </button>

        {isEditingTitle ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSubmit();
              if (e.key === "Escape") {
                setEditedTitle(task.title);
                setIsEditingTitle(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-7 min-w-0"
            autoFocus
          />
        ) : (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
            className={cn(
              "cursor-text break-words",
              isDone && "line-through"
            )}
          >
            {task.title}
          </span>
        )}

        <div className="flex-1" onClick={(e) => e.stopPropagation()} />

        <div className="flex items-center gap-1.5">
          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "secondary"}
              className="text-xs cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleTagToggle(tag);
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 rounded border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            {task.priority}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {(["Highest", "High", "Medium", "Normal", "Low", "Lowest"] as TaskPriority[]).map((priority) => (
              <DropdownMenuItem
                key={priority}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdatePriority(task.id, priority);
                }}
                className="cursor-pointer"
              >
                {priority}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isDone ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatCompletedDate(task.completedAt)}
          </div>
        ) : (
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Calendar className="h-4 w-4" />
              {task.scheduledDate
                ? format(parseDateString(task.scheduledDate), "MMM d")
                : "Backlog"}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={
                  task.scheduledDate ? parseDateString(task.scheduledDate) : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    // Ensure we're using local date values, not UTC
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const dateString = `${year}-${month}-${day}`;
                    onSchedule(task.id, dateString);
                    setIsDatePickerOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      <CollapsibleContent className="px-3 pb-4">
        <TaskItemExpanded
          task={task}
          onUpdateNotes={onUpdateNotes}
          onUpdateTags={onUpdateTags}
          onSchedule={onSchedule}
          onDelete={onDelete}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
