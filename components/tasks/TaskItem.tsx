"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskItemExpanded } from "./TaskItemExpanded";
import type { Task } from "@/features/tasks/types";

interface TaskItemProps {
  task: Task;
  onToggleDone: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({
  task,
  onToggleDone,
  onUpdateTitle,
  onUpdateNotes,
  onSchedule,
  onDelete,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

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
    const d = new Date(date);
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

  return (
    <div
      className={cn(
        "rounded-lg border bg-card transition-colors",
        isDone && "opacity-60"
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <button
          onClick={() => onToggleDone(task.id)}
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
            className="h-7 flex-1"
            autoFocus
          />
        ) : (
          <span
            onClick={() => setIsEditingTitle(true)}
            className={cn(
              "flex-1 cursor-text truncate",
              isDone && "line-through"
            )}
          >
            {task.title}
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {isDone ? formatCompletedDate(task.completedAt) : formatScheduledDate(task.scheduledDate)}
        </div>
      </div>

      {isExpanded && (
        <TaskItemExpanded
          task={task}
          onUpdateNotes={onUpdateNotes}
          onSchedule={onSchedule}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
