"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TaskFilters, BacklogView } from "@/components/tasks";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";

export default function BacklogPage() {
  const { search, setSearch, selectedTags, setSelectedTags, statusFilter, setStatusFilter, handleTagToggle } = useTaskFilter();
  const { tasks, addTask, updateTask, deleteTask, toggleTaskDone } = useTaskState();
  const { setLeftContent } = useTopNavActions();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedTags.length > 0 && !selectedTags.some((tag) => task.tags.includes(tag))) {
        return false;
      }
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [tasks, search, selectedTags, statusFilter]);

  const hasActiveFilters = !!search || selectedTags.length > 0 || statusFilter !== "all";

  // Set top nav content
  useEffect(() => {
    setLeftContent(
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNewTask(true)}
          title="Press N to create task"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(true)}
          title="Press / to search and filter"
        >
          <Search className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                setSearch("");
                setSelectedTags([]);
                setStatusFilter("all");
              }}
              className="flex items-center gap-2 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <Sliders className="h-4 w-4" />
              Filtering
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" style={{ maxWidth: "500px" }}>
              <div className="text-xs space-y-1">
                {search && <div>Search: {search}</div>}
                {selectedTags.length > 0 && <div>Tags: {selectedTags.join(", ")}</div>}
                {statusFilter !== "all" && <div>Status: {statusFilter}</div>}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );

    return () => setLeftContent(undefined);
  }, [setLeftContent, hasActiveFilters, search, selectedTags, statusFilter, setSearch, setSelectedTags, setStatusFilter]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // N key for new task
      if (e.key === "n" && !showNewTask && !showFilters && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setShowNewTask(true);
      }
      // / key for search/filters
      if (e.key === "/" && !showNewTask && !showFilters && !(e.target instanceof HTMLInputElement)) {
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
  }, [showNewTask, showFilters]);

  const handleToggleDone = (id: string) => toggleTaskDone(id);

  const handleUpdateTitle = (id: string, title: string) => {
    updateTask(id, { title });
  };

  const handleUpdateNotes = (id: string, notesMarkdown: string) => {
    updateTask(id, { notesMarkdown });
  };

  const handleSchedule = (id: string, date: string | null) => {
    updateTask(id, {
      scheduledDate: date ?? undefined,
      status: date ? "scheduled" : "backlog",
    });
  };

  const handleDelete = (id: string) => deleteTask(id);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      notesMarkdown: "",
      tags: [],
      status: "backlog" as const,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: "demo",
    };

    addTask(newTask);
    setNewTaskTitle("");
    setShowNewTask(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      {/* Backlog view */}
      <BacklogView
        tasks={filteredTasks}
        onToggleDone={handleToggleDone}
        onUpdateTitle={handleUpdateTitle}
        onUpdateNotes={handleUpdateNotes}
        onSchedule={handleSchedule}
        onDelete={handleDelete}
      />

      {/* New task modal */}
      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
              }}
              autoFocus
            />
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
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
