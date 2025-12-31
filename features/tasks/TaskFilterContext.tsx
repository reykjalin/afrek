"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface TaskFilterContextType {
  search: string;
  setSearch: (search: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  handleTagToggle: (tag: string) => void;
  clearFilters: () => void;
}

const TaskFilterContext = createContext<TaskFilterContextType | undefined>(
  undefined,
);

export function TaskFilterProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearchState] = useState(() => searchParams.get("q") ?? "");
  const [selectedTags, setSelectedTagsState] = useState<string[]>(() => {
    const tags = searchParams.get("tags");
    return tags ? tags.split(",").filter(Boolean) : [];
  });

  const updateUrl = useCallback(
    (newSearch: string, newTags: string[]) => {
      const params = new URLSearchParams();
      if (newSearch) params.set("q", newSearch);
      if (newTags.length > 0) params.set("tags", newTags.join(","));
      const queryString = params.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  const setSearch = useCallback(
    (newSearch: string) => {
      setSearchState(newSearch);
      updateUrl(newSearch, selectedTags);
    },
    [updateUrl, selectedTags],
  );

  const setSelectedTags = useCallback(
    (tags: string[]) => {
      setSelectedTagsState(tags);
      updateUrl(search, tags);
    },
    [updateUrl, search],
  );

  const handleTagToggle = useCallback(
    (tag: string) => {
      const newTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
      setSelectedTags(newTags);
    },
    [selectedTags, setSelectedTags],
  );

  const clearFilters = useCallback(() => {
    setSearchState("");
    setSelectedTagsState([]);
    updateUrl("", []);
  }, [updateUrl]);

  useEffect(() => {
    const urlSearch = searchParams.get("q") ?? "";
    const urlTags = searchParams.get("tags");
    const urlTagsArray = urlTags ? urlTags.split(",").filter(Boolean) : [];

    setSearchState(urlSearch);
    setSelectedTagsState(urlTagsArray);
  }, [searchParams]);

  return (
    <TaskFilterContext.Provider
      value={{
        search,
        setSearch,
        selectedTags,
        setSelectedTags,
        handleTagToggle,
        clearFilters,
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
