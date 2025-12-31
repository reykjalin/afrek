"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilters } from "@/components/tasks";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTopNavActions } from "@/features/layout/TopNavActionsContext";
import { getStartOfWeek, getWeekNumber, formatWeekRange } from "@/lib/date";
import type { Task, TaskPriority } from "@/features/tasks/types";

export default function CompletedPage() {
  const { tasks, updateTask, deleteTask, toggleTaskDone } = useTaskState();
  const { search, setSearch, selectedTags, setSelectedTags, handleTagToggle, clearFilters } = useTaskFilter();
  const { setLeftContent } = useTopNavActions();
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [showFilters, setShowFilters] = useState(false);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks
      .filter((task): task is Task & { completedAt: number } => 
        task.status === "done" && task.completedAt !== undefined
      )
      .sort((a, b) => b.completedAt - a.completedAt);
  }, [tasks]);

  const tasksForSelectedWeek = useMemo(() => {
    return completedTasks
      .filter((task) => {
        const completedDate = new Date(task.completedAt);
        const taskWeekStart = getStartOfWeek(completedDate);
        return taskWeekStart.toDateString() === weekStart.toDateString();
      })
      .filter((task) => {
        if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        if (selectedTags.length > 0 && !selectedTags.some((tag) => task.tags.includes(tag))) {
          return false;
        }
        return true;
      });
  }, [completedTasks, weekStart, search, selectedTags]);

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
      if (e.key === "/" && !showFilters && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setShowFilters(true);
      }
      if (e.key === "Escape") {
        setShowFilters(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFilters]);

  const goToPreviousWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

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

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="mx-auto w-full max-w-4xl">
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

          <TaskList
            tasks={tasksForSelectedWeek}
            onToggleDone={handleToggleDone}
            onUpdateTitle={handleUpdateTitle}
            onUpdateNotes={handleUpdateNotes}
            onUpdateTags={handleUpdateTags}
            onSchedule={handleSchedule}
            onDelete={handleDelete}
            onUpdatePriority={handleUpdatePriority}
            emptyMessage="No completed tasks this week"
          />
        </div>
      </div>

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
