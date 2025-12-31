"use client";

import { useState, useMemo, useEffect } from "react";
import { Inbox, Plus, Search, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilters } from "@/components/tasks";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";
import type { TaskPriority } from "@/features/tasks/types";

export default function BacklogPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskDone } = useTaskState();
  const { search, setSearch, selectedTags, setSelectedTags, handleTagToggle, clearFilters } = useTaskFilter();
  const { setLeftContent } = useTopNavActions();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTags, setNewTaskTags] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const backlogTasks = useMemo(() => {
    return tasks
      .filter((task) => task.status === "backlog")
      .filter((task) => {
        if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        if (selectedTags.length > 0 && !selectedTags.some((tag) => task.tags.includes(tag))) {
          return false;
        }
        return true;
      });
  }, [tasks, search, selectedTags]);

  const hasActiveFilters = !!search || selectedTags.length > 0;

  useEffect(() => {
    setLeftContent(
      <div className="flex items-center gap-2">
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
      </div>
    );

    return () => setLeftContent(undefined);
  }, [setLeftContent, hasActiveFilters, search, selectedTags, setSearch, setSelectedTags]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" && !showNewTask && !showFilters && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setShowNewTask(true);
      }
      if (e.key === "/" && !showNewTask && !showFilters && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setShowFilters(true);
      }
      if (e.key === "Escape") {
        setShowNewTask(false);
        setShowFilters(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNewTask, showFilters]);

  const handleToggleDone = (id: string) => toggleTaskDone(id);

  const handleUpdateTitle = (id: string, title: string) => {
    updateTask(id, { title });
  };

  const handleUpdateNotes = (id: string, notesMarkdown: string) => {
    updateTask(id, { notesMarkdown });
  };

  const handleUpdateTags = (id: string, tags: string[]) => {
    updateTask(id, { tags });
  };

  const handleSchedule = (id: string, date: string | null) => {
    updateTask(id, {
      scheduledDate: date ?? undefined,
      status: date ? "scheduled" : "backlog",
    });
  };

  const handleDelete = (id: string) => deleteTask(id);

  const handleUpdatePriority = (id: string, priority: TaskPriority) => {
    updateTask(id, { priority });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const tags = newTaskTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const newTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      notesMarkdown: "",
      tags,
      status: "backlog" as const,
      priority: "Normal" as const,
      scheduledDate: undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: "demo",
    };

    addTask(newTask);
    setNewTaskTitle("");
    setNewTaskTags("");
    setShowNewTask(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Inbox className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Backlog</h1>
        </div>
        <TaskList
          tasks={backlogTasks}
          onToggleDone={handleToggleDone}
          onUpdateTitle={handleUpdateTitle}
          onUpdateNotes={handleUpdateNotes}
          onUpdateTags={handleUpdateTags}
          onSchedule={handleSchedule}
          onDelete={handleDelete}
          onUpdatePriority={handleUpdatePriority}
          emptyMessage="No tasks in backlog"
        />
      </div>

      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-title">Title</Label>
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
              <Label htmlFor="task-tags">Tags</Label>
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
