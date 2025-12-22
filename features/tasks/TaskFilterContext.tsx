"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TaskFilterContextType {
  search: string;
  setSearch: (search: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  handleTagToggle: (tag: string) => void;
}

const TaskFilterContext = createContext<TaskFilterContextType | undefined>(undefined);

export function TaskFilterProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <TaskFilterContext.Provider
      value={{
        search,
        setSearch,
        selectedTags,
        setSelectedTags,
        handleTagToggle,
      }}
    >
      {children}
    </TaskFilterContext.Provider>
  );
}

export function useTaskFilter() {
  const context = useContext(TaskFilterContext);
  if (!context) {
    throw new Error("useTaskFilter must be used within TaskFilterProvider");
  }
  return context;
}
