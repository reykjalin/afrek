"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Value } from "platejs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagPill } from "@/components/ui/tag-pill";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TitleEditor, textToTitleValue, titleValueToText } from "@/components/editors/TitleEditor";
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
  newTaskTitleValue?: Value;
  onNewTaskTitleChange?: (value: Value) => void;
  newTaskTags?: string;
  onNewTaskTagsChange?: (tags: string) => void;
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
  newTaskTitleValue,
  onNewTaskTitleChange,
  newTaskTags,
  onNewTaskTagsChange,
  onCreateTask,
  onCancelCreate,
}: WeeklyViewProps) {
  const weekDays = getWeekDays(weekStart);
  const { focusedTaskId, setFocusedTaskId } = useTaskFocus();

  // Local input state for the tag text box
  const [newTagInput, setNewTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Parse current tags from comma-separated string
  const currentTags = useMemo(() => {
    if (!newTaskTags) return [];
    return newTaskTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [newTaskTags]);

  // All existing tags for autocomplete
  const allTags = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [tasks]);

  const availableTags = useMemo(
    () => allTags.filter((t) => !currentTags.includes(t)),
    [allTags, currentTags]
  );

  const filteredTags = newTagInput
    ? availableTags.filter((t) => t.toLowerCase().includes(newTagInput.toLowerCase()))
    : [];

  const updateNewTaskTags = (tags: string[]) => {
    onNewTaskTagsChange?.(tags.join(","));
  };

  const handleAddTagFromInput = () => {
    const trimmed = newTagInput.trim().replace(/,/g, "");
    if (!trimmed) return;
    if (!currentTags.includes(trimmed)) {
      updateNewTaskTags([...currentTags, trimmed]);
    }
    setNewTagInput("");
  };

  const handleAddTagFromSuggestion = (tag: string) => {
    if (!currentTags.includes(tag)) {
      updateNewTaskTags([...currentTags, tag]);
    }
    setNewTagInput("");
    // Refocus input for continuous tag entry
    setTimeout(() => tagInputRef.current?.focus(), 0);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateNewTaskTags(currentTags.filter((t) => t !== tagToRemove));
  };

  // Reset tag input when not creating
  useEffect(() => {
    if (!isCreatingTask) {
      setNewTagInput("");
    }
  }, [isCreatingTask]);

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
                <div className="mt-2 flex flex-col sm:flex-row sm:items-start gap-2 p-2 rounded-lg border bg-muted/30">
                  {/* Title editor - rich text */}
                  <div className="flex-1 min-w-0">
                    <TitleEditor
                      value={newTaskTitleValue ?? textToTitleValue("")}
                      onChange={(value) => onNewTaskTitleChange?.(value)}
                      placeholder="Task title..."
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Escape") onCancelCreate?.();
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          const titleText = titleValueToText(newTaskTitleValue ?? textToTitleValue(""));
                          if (titleText.trim()) {
                            onCreateTask?.();
                          }
                        }
                      }}
                      containerClassName="border-none bg-transparent [&_p]:my-0"
                      className="text-sm"
                    />
                  </div>

                  {/* Tags: pills + autocomplete */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {currentTags.map((tag) => (
                      <TagPill
                        key={tag}
                        tag={tag}
                        onRemove={() => handleRemoveTag(tag)}
                      />
                    ))}

                    <div className="relative">
                      <Input
                        ref={tagInputRef}
                        placeholder="+ tag"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newTagInput.trim()) {
                              handleAddTagFromInput();
                            } else {
                              onCreateTask?.();
                            }
                          }
                          if (e.key === "Escape") {
                            onCancelCreate?.();
                          }
                        }}
                        className="h-5 w-16 border-none bg-transparent px-1 py-0 text-[11px] shadow-none focus-visible:ring-0"
                      />
                      {filteredTags.length > 0 && newTagInput && (
                        <div className="absolute top-full left-0 mt-1 w-40 max-h-32 overflow-auto rounded-md border bg-popover text-xs shadow-md z-10">
                          {filteredTags.slice(0, 5).map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleAddTagFromSuggestion(tag)}
                              className="w-full px-2 py-1.5 text-left hover:bg-accent focus:bg-accent focus:outline-none"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
