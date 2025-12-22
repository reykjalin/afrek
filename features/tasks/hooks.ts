import { useState } from "react";
import type { TaskFilters, TaskStatus } from "./types";

export function useTaskFilters() {
  const [filters, setFilters] = useState<TaskFilters>({
    view: "week",
  });

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined }));
  };

  const setTags = (tags: string[]) => {
    setFilters((prev) => ({ ...prev, tags: tags.length ? tags : undefined }));
  };

  const setStatus = (status: TaskStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const setView = (view: TaskFilters["view"]) => {
    setFilters((prev) => ({ ...prev, view }));
  };

  const setWeekStart = (weekStart: string) => {
    setFilters((prev) => ({ ...prev, weekStart }));
  };

  return {
    filters,
    setSearch,
    setTags,
    setStatus,
    setView,
    setWeekStart,
  };
}
