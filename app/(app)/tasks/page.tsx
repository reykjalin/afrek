"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, Search, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { TaskFilters, WeeklyView } from "@/components/tasks";
import { UpgradeCTA } from "@/components/UpgradeCTA";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";
import { TaskAccessProvider, useTaskAccess } from "@/features/billing";
import { getStartOfWeek, getTodayString } from "@/lib/date";
import { isEditableElement } from "@/lib/keyboard";
import type { TaskPriority } from "@/features/tasks/types";

const today = getTodayString();

function TasksPageContent() {
  const { search, setSearch, selectedTags, setSelectedTags, handleTagToggle, clearFilters } = useTaskFilter();
  const { tasks, addTask, updateTask, deleteTask, toggleTaskDone } = useTaskState();
  const { setLeftContent } = useTopNavActions();
  const { readOnly, isLoading: isAccessLoading } = useTaskAccess();
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTags, setNewTaskTags] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const hasActiveFilters = !!search || selectedTags.length > 0;

  const isCurrentWeek = useCallback(() => {
    const currentWeekStart = getStartOfWeek(new Date());
    return weekStart.toDateString() === currentWeekStart.toDateString();
  }, [weekStart]);

  const goToCurrentWeek = () => {
    setWeekStart(getStartOfWeek(new Date()));
  };

  // Set top nav content
  useEffect(() => {
    setLeftContent(
      <div className="flex items-center gap-2">
        {!readOnly && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewTask(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>
              <div className="flex items-center gap-2">
                <span>Create Task</span>
                <Kbd>N</Kbd>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent>
            <div className="flex items-center gap-2">
              <span>Search</span>
              <Kbd>/</Kbd>
            </div>
          </TooltipContent>
        </Tooltip>
        {hasActiveFilters && (
          <Tooltip>
            <TooltipTrigger
              onClick={() => clearFilters()}
              className="flex items-center gap-2 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <Sliders className="h-4 w-4" />
              Filtering
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" style={{ maxWidth: "500px" }}>
              <div className="text-xs space-y-1">
                {search && <div>Search: {search}</div>}
                {selectedTags.length > 0 && <div>Tags: {selectedTags.join(", ")}</div>}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
        {!isCurrentWeek() && (
          <Button size="sm" onClick={goToCurrentWeek}>
            Go to current week
          </Button>
        )}
      </div>
    );

    return () => setLeftContent(undefined);
  }, [setLeftContent, hasActiveFilters, search, selectedTags, setSearch, setSelectedTags, weekStart, readOnly, clearFilters, isCurrentWeek]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip shortcuts when typing in editable elements (inputs, textareas, rich text editors)
      if (isEditableElement(e.target)) {
        // Still allow Escape to close modals
        if (e.key === "Escape") {
          setShowNewTask(false);
          setShowFilters(false);
        }
        return;
      }

      // N key for new task (only when not readOnly)
      if (e.key === "n" && !readOnly && !showNewTask && !showFilters) {
        e.preventDefault();
        setShowNewTask(true);
      }
      // / key for search/filters
      if (e.key === "/" && !showNewTask && !showFilters) {
        e.preventDefault();
        setShowFilters(true);
      }
      // Escape to close modals
      if (e.key === "Escape") {
        setShowNewTask(false);
        setShowFilters(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNewTask, showFilters, readOnly]);

  const handleToggleDone = (id: string) => toggleTaskDone(id);

  const handleUpdateTitle = (id: string, title: string) => {
    updateTask(id, { title });
  };

  const handleUpdateNotes = (id: string, notesJson: string) => {
    updateTask(id, { notesJson });
  };

  const handleUpdateTags = (id: string, tags: string[]) => {
    updateTask(id, { tags });
  };

  const handleSchedule = (id: string, date: string | null) => {
    updateTask(id, {
      scheduledDate: date,
      status: date ? "scheduled" : "backlog",
    });
  };

  const handleDelete = (id: string) => deleteTask(id);

  const handleUpdatePriority = (id: string, priority: TaskPriority) => {
    updateTask(id, { priority });
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    const tags = newTaskTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    await addTask({
      title: newTaskTitle.trim(),
      notesJson: "",
      tags,
      status: "scheduled" as const,
      priority: "Normal" as const,
      scheduledDate: today,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: "demo",
    });

    setNewTaskTitle("");
    setNewTaskTags("");
    setShowNewTask(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-4">
        {!isAccessLoading && readOnly && <UpgradeCTA />}
        {/* Weekly view */}
        <WeeklyView
        tasks={tasks}
        weekStart={weekStart}
        onWeekChange={setWeekStart}
        onToggleDone={handleToggleDone}
        onUpdateTitle={handleUpdateTitle}
        onUpdateNotes={handleUpdateNotes}
        onUpdateTags={handleUpdateTags}
        onSchedule={handleSchedule}
        onDelete={handleDelete}
        onUpdatePriority={handleUpdatePriority}
        />
        </div>

        {/* New task modal */}
      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-title">
                Title
              </Label>
              <Input
                id="task-title"
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                }}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-tags">
                Tags
              </Label>
              <Input
                id="task-tags"
                placeholder="Tags (comma-separated)..."
                value={newTaskTags}
                onChange={(e) => setNewTaskTags(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewTask(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search and filters modal */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent
          className="max-w-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setShowFilters(false);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Search & Filter</DialogTitle>
          </DialogHeader>
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            availableTags={availableTags}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function TasksPage() {
  return (
    <TaskAccessProvider>
      <TasksPageContent />
    </TaskAccessProvider>
  );
}
