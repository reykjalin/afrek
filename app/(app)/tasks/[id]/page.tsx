"use client";

import { use, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { Value } from "platejs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TagPill } from "@/components/ui/tag-pill";
import { Input } from "@/components/ui/input";
import { TitleEditor, textToTitleValue } from "@/components/editors/TitleEditor";
import { NotesEditor } from "@/components/editors/NotesEditor";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { TaskAccessProvider, useTaskAccess } from "@/features/billing";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";
import { parseDateString } from "@/lib/date";
import { startViewTransition } from "@/lib/viewTransition";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

function TaskDetailContent({ taskId }: { taskId: string }) {
  const router = useRouter();
  const { tasks, updateTask, isLoading } = useTaskState();
  const { readOnly } = useTaskAccess();
  const { setLeftContent, setRightContent } = useTopNavActions();
  
  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId]);
  
  const orderedTaskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
  const currentIndex = orderedTaskIds.indexOf(taskId);
  const prevTaskId = currentIndex > 0 ? orderedTaskIds[currentIndex - 1] : null;
  const nextTaskId = currentIndex < orderedTaskIds.length - 1 ? orderedTaskIds[currentIndex + 1] : null;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  // Local state for editors to prevent full page rerenders on each keystroke
  // Component is keyed by taskId in the parent, so state resets on task change
  const [titleValue, setTitleValue] = useState<Value>(() => {
    if (task?.titleJson) {
      try {
        return JSON.parse(task.titleJson) as Value;
      } catch {
        return textToTitleValue("");
      }
    }
    return textToTitleValue("");
  });

  const [notesValue, setNotesValue] = useState<Value>(() => {
    if (task?.notesJson) {
      try {
        return JSON.parse(task.notesJson) as Value;
      } catch {
        return [{ type: "p", children: [{ text: "" }] }];
      }
    }
    return [{ type: "p", children: [{ text: "" }] }];
  });

  // Debounced persistence to avoid global state updates on each keystroke
  const debouncedPersistTitle = useDebouncedCallback((value: Value) => {
    if (readOnly || !task) return;
    const newJson = JSON.stringify(value);
    if (newJson !== task.titleJson) {
      updateTask(task.id, { titleJson: newJson });
    }
  }, 400);

  const debouncedPersistNotes = useDebouncedCallback((value: Value) => {
    if (readOnly || !task) return;
    const newJson = JSON.stringify(value);
    if (newJson !== task.notesJson) {
      updateTask(task.id, { notesJson: newJson });
    }
  }, 400);

  const handleTitleChange = useCallback((value: Value) => {
    setTitleValue(value);
    debouncedPersistTitle(value);
  }, [debouncedPersistTitle]);

  const handleNotesChange = useCallback((value: Value) => {
    setNotesValue(value);
    debouncedPersistNotes(value);
  }, [debouncedPersistNotes]);

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

  const availableTags = useMemo(() => {
    if (!task) return [];
    const tagSet = new Set<string>();
    tasks.forEach(t => t.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).filter(t => !task.tags.includes(t)).sort();
  }, [tasks, task]);

  const filteredTags = useMemo(() => {
    if (!newTag) return [];
    return availableTags.filter(t => t.toLowerCase().includes(newTag.toLowerCase()));
  }, [availableTags, newTag]);

  const handleClose = useCallback(() => {
    startViewTransition(() => router.back());
  }, [router]);

  const goToPrev = useCallback(() => {
    if (prevTaskId) startViewTransition(() => router.push(`/tasks/${prevTaskId}`));
  }, [router, prevTaskId]);

  const goToNext = useCallback(() => {
    if (nextTaskId) startViewTransition(() => router.push(`/tasks/${nextTaskId}`));
  }, [router, nextTaskId]);

  // Set top nav actions
  useEffect(() => {
    setLeftContent(
      <Tooltip>
        <TooltipTrigger onClick={handleClose} render={<Button variant="ghost" size="icon" />}>
          <X className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>Close</TooltipContent>
      </Tooltip>
    );
    setRightContent(
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger onClick={goToPrev} disabled={!prevTaskId} render={<Button variant="ghost" size="icon" />}>
            <ChevronLeft className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>Previous task</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger onClick={goToNext} disabled={!nextTaskId} render={<Button variant="ghost" size="icon" />}>
            <ChevronRight className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>Next task</TooltipContent>
        </Tooltip>
      </div>
    );
    return () => {
      setLeftContent(undefined);
      setRightContent(undefined);
    };
  }, [setLeftContent, setRightContent, handleClose, goToPrev, goToNext, prevTaskId, nextTaskId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!task) {
    notFound();
  }

  if (task.isLocked) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Task is encrypted</p>
          <p className="text-sm mt-1">Unlock encryption to view this task</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Content */}
      <div className="flex-1 overflow-auto p-6" style={{ viewTransitionName: "task-detail" }}>
        <div className="mx-auto max-w-[46rem]">
          {/* Title */}
          <TitleEditor
            value={titleValue}
            onChange={handleTitleChange}
            readOnly={readOnly}
            containerClassName="text-2xl font-semibold border-none bg-transparent px-0 py-0"
          />

          {/* Metadata: inline under title */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
            {/* Scheduled date */}
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger
                disabled={readOnly}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 hover:bg-muted/60 transition-colors disabled:opacity-60"
              >
                <Calendar className="h-3 w-3" />
                <span>
                  {task.scheduledDate
                    ? format(parseDateString(task.scheduledDate), "EEE, MMM d")
                    : "Add date"}
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={task.scheduledDate ? parseDateString(task.scheduledDate) : undefined}
                  onSelect={handleSchedule}
                />
              </PopoverContent>
            </Popover>

            {/* Divider dot */}
            {(task.tags.length > 0 || !readOnly) && <span>•</span>}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              {task.tags.map(tag => (
                <TagPill
                  key={tag}
                  tag={tag}
                  onRemove={!readOnly ? () => handleRemoveTag(tag) : undefined}
                />
              ))}

              {!readOnly && (
                <div className="relative">
                  <Input
                    placeholder="+ tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="h-5 w-16 border-none bg-transparent px-1 py-0 text-[11px] shadow-none focus-visible:ring-0"
                  />
                  {filteredTags.length > 0 && newTag && (
                    <div className="absolute top-full left-0 mt-1 w-40 max-h-32 overflow-auto rounded-md border bg-popover text-xs shadow-md z-10">
                      {filteredTags.slice(0, 5).map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            if (!task.tags.includes(tag)) {
                              updateTask(task.id, { tags: [...task.tags, tag] });
                            }
                            setNewTag("");
                          }}
                          className="w-full px-2 py-1.5 text-left hover:bg-accent focus:bg-accent focus:outline-none"
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

          {/* Notes */}
          <section className="pt-6">
            <h2 className="sr-only">Notes</h2>
            <div className="min-h-[60vh]">
              <NotesEditor
                value={notesValue}
                onChange={handleNotesChange}
                readOnly={readOnly}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = use(params);
  
  return (
    <TaskAccessProvider>
      {/* Key forces remount when navigating between tasks, resetting editor state */}
      <TaskDetailContent key={id} taskId={id} />
    </TaskAccessProvider>
  );
}
