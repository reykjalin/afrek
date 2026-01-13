"use client";

import { use, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { Value } from "platejs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TitleEditor, textToTitleValue } from "@/components/editors/TitleEditor";
import { NotesEditor } from "@/components/editors/NotesEditor";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { TaskAccessProvider, useTaskAccess } from "@/features/billing";
import { parseDateString } from "@/lib/date";
import { startViewTransition } from "@/lib/viewTransition";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

function TaskDetailContent({ taskId }: { taskId: string }) {
  const router = useRouter();
  const { tasks, updateTask } = useTaskState();
  const { readOnly } = useTaskAccess();
  
  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId]);
  
  const orderedTaskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
  const currentIndex = orderedTaskIds.indexOf(taskId);
  const prevTaskId = currentIndex > 0 ? orderedTaskIds[currentIndex - 1] : null;
  const nextTaskId = currentIndex < orderedTaskIds.length - 1 ? orderedTaskIds[currentIndex + 1] : null;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const titleJson = task?.titleJson;
  const titleValue = useMemo<Value>(() => {
    if (titleJson) {
      try {
        return JSON.parse(titleJson) as Value;
      } catch {
        return textToTitleValue("");
      }
    }
    return textToTitleValue("");
  }, [titleJson]);

  const notesJson = task?.notesJson;
  const notesValue = useMemo<Value>(() => {
    if (notesJson) {
      try {
        return JSON.parse(notesJson) as Value;
      } catch {
        return [{ type: "p", children: [{ text: "" }] }];
      }
    }
    return [{ type: "p", children: [{ text: "" }] }];
  }, [notesJson]);

  const handleTitleChange = useCallback((value: Value) => {
    if (readOnly || !task) return;
    const newJson = JSON.stringify(value);
    if (newJson !== task.titleJson) {
      updateTask(task.id, { titleJson: newJson });
    }
  }, [readOnly, task, updateTask]);

  const handleNotesChange = useCallback((value: Value) => {
    if (readOnly || !task) return;
    const newJson = JSON.stringify(value);
    if (newJson !== task.notesJson) {
      updateTask(task.id, { notesJson: newJson });
    }
  }, [readOnly, task, updateTask]);

  const handleSchedule = useCallback((date: Date | undefined) => {
    if (readOnly || !task || !date) return;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    updateTask(task.id, { scheduledDate: `${year}-${month}-${day}`, status: "scheduled" });
    setIsDatePickerOpen(false);
  }, [readOnly, task, updateTask]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    if (readOnly || !task) return;
    updateTask(task.id, { tags: task.tags.filter(t => t !== tagToRemove) });
  }, [readOnly, task, updateTask]);

  const handleAddTag = useCallback(() => {
    if (readOnly || !task) return;
    const trimmed = newTag.trim().replace(/,/g, "");
    if (trimmed && !task.tags.includes(trimmed)) {
      updateTask(task.id, { tags: [...task.tags, trimmed] });
    }
    setNewTag("");
  }, [readOnly, task, updateTask, newTag]);

  const handleClose = () => {
    startViewTransition(() => router.back());
  };

  const goToPrev = () => {
    if (prevTaskId) startViewTransition(() => router.push(`/tasks/${prevTaskId}`));
  };

  const goToNext = () => {
    if (nextTaskId) startViewTransition(() => router.push(`/tasks/${nextTaskId}`));
  };

  if (!task) {
    notFound();
  }

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(t => t.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).filter(t => !task.tags.includes(t)).sort();
  }, [tasks, task.tags]);

  const filteredTags = newTag 
    ? availableTags.filter(t => t.toLowerCase().includes(newTag.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={handleClose} />}>
            <X className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
        
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={goToPrev} disabled={!prevTaskId} />}>
              <ChevronLeft className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Previous task</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={goToNext} disabled={!nextTaskId} />}>
              <ChevronRight className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Next task</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6" style={{ viewTransitionName: "task-detail" }}>
        <div className="mx-auto max-w-[46rem] space-y-8">
          {/* Title */}
          <TitleEditor
            value={titleValue}
            onChange={handleTitleChange}
            readOnly={readOnly}
            containerClassName="text-2xl font-semibold border-none bg-transparent"
          />

          {/* Metadata: Schedule + Tags */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
            {/* Scheduled date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Scheduled
              </label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger
                  disabled={readOnly}
                  className="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground transition-colors disabled:opacity-60"
                >
                  <Calendar className="h-4 w-4" />
                  {task.scheduledDate
                    ? format(parseDateString(task.scheduledDate), "EEEE, MMMM d, yyyy")
                    : "Not scheduled"}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={task.scheduledDate ? parseDateString(task.scheduledDate) : undefined}
                    onSelect={handleSchedule}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Tags */}
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {task.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    {!readOnly && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {!readOnly && (
                  <div className="relative">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="h-7 w-28 text-sm"
                    />
                    {filteredTags.length > 0 && newTag && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-popover border rounded-md shadow-md z-10 max-h-32 overflow-auto">
                        {filteredTags.slice(0, 5).map(tag => (
                          <button
                            key={tag}
                            onClick={() => {
                              if (!task.tags.includes(tag)) {
                                updateTask(task.id, { tags: [...task.tags, tag] });
                              }
                              setNewTag("");
                            }}
                            className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Notes
            </label>
            <div className="min-h-[300px] rounded-lg border bg-muted/5 p-4">
              <NotesEditor
                value={notesValue}
                onChange={handleNotesChange}
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = use(params);
  
  return (
    <TaskAccessProvider>
      <TaskDetailContent taskId={id} />
    </TaskAccessProvider>
  );
}
