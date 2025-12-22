"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TaskFilters } from "@/components/tasks";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";

export default function CompletedPage() {
  const { search, setSearch, selectedTags, setSelectedTags, handleTagToggle } = useTaskFilter();
  const { tasks, updateTask, deleteTask } = useTaskState();
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
    return tasks
      .filter((task) => task.status === "done")
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

  // Set top nav content
  useEffect(() => {
    setLeftContent(
      <div className="flex items-center gap-2">
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
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );

    return () => setLeftContent(undefined);
  }, [setLeftContent, hasActiveFilters, search, selectedTags, setSearch, setSelectedTags]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const handleToggleDone = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      updateTask(id, {
        status: task.scheduledDate ? "scheduled" : "backlog",
      });
    }
  };

  const handleUpdateTitle = (id: string, title: string) => {
    updateTask(id, { title });
  };

  const handleDelete = (id: string) => deleteTask(id);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Completed tasks list */}
      <div className="flex flex-col gap-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No completed tasks</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors group"
            >
              <button
                onClick={() => handleToggleDone(task.id)}
                className="mt-1 flex-shrink-0 h-5 w-5 rounded border-2 border-green-600 bg-green-600 flex items-center justify-center"
                title="Mark as incomplete"
              >
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm line-through text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleToggleDone(task.id)}
                >
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {task.completedAt
                      ? new Date(task.completedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </span>
                </div>
                {task.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {task.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(task.id)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                title="Delete task"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

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
