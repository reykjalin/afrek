"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import {
  ListTodo,
  CheckCircle2,
  Settings,
  Search,
  X,
  Tag,
  LogOut,
  ArrowLeft,
  Plus,
  CalendarPlus,
} from "lucide-react";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandEmpty,
} from "@/components/ui/command";
import { useCommandBar } from "@/features/command-bar";
import { useTaskFilter } from "@/features/tasks/TaskFilterContext";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { useTaskFocus } from "@/features/tasks/TaskFocusContext";
import { getTomorrowString } from "@/lib/date";

export function CommandBar() {
  const { open, mode, closeCommandBar, setMode, requestCreateTask } = useCommandBar();
  const router = useRouter();
  const { search, setSearch, selectedTags, handleTagToggle, clearFilters, debouncedSearch } =
    useTaskFilter();
  const { tasks, updateTask } = useTaskState();
  const { signOut } = useAuth();
  const { focusedTaskId } = useTaskFocus();

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const hasActiveSearch = !!debouncedSearch;

  const handleSelect = (action: string) => {
    switch (action) {
      case "tasks":
        router.push("/tasks");
        closeCommandBar();
        break;
      case "completed":
        router.push("/completed");
        closeCommandBar();
        break;
      case "settings":
        router.push("/settings");
        closeCommandBar();
        break;
      case "search":
        setMode("search");
        break;
      case "clear-search":
        clearFilters();
        closeCommandBar();
        break;
      case "tags":
        setMode("tags");
        break;
      case "create-task":
        requestCreateTask();
        break;
      case "logout":
        signOut({ returnTo: "/" });
        break;
      case "reschedule-tomorrow":
        if (focusedTaskId) {
          updateTask(focusedTaskId, {
            scheduledDate: getTomorrowString(),
            status: "scheduled",
          });
        }
        closeCommandBar();
        break;
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      closeCommandBar();
    }
    if (e.key === "Backspace" && !search) {
      setMode("commands");
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={(isOpen) => !isOpen && closeCommandBar()}>
      <Command shouldFilter={mode === "commands"}>
        {mode === "search" ? (
          <CommandInput
            placeholder="Search tasks..."
            value={search}
            onValueChange={setSearch}
            onKeyDown={handleSearchKeyDown}
          />
        ) : mode === "tags" ? (
          <CommandInput placeholder="Filter by tag..." />
        ) : (
          <CommandInput placeholder="Type a command..." />
        )}

        <CommandList>
          {mode === "commands" && (
            <>
              <CommandGroup heading="Actions">
                <CommandItem onSelect={() => handleSelect("create-task")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                  <CommandShortcut>N</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("search")}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                  <CommandShortcut>/</CommandShortcut>
                </CommandItem>
                {hasActiveSearch && (
                  <CommandItem onSelect={() => handleSelect("clear-search")}>
                    <X className="mr-2 h-4 w-4" />
                    Clear Search
                  </CommandItem>
                )}
                <CommandItem onSelect={() => handleSelect("tags")}>
                  <Tag className="mr-2 h-4 w-4" />
                  Filter by Tag
                </CommandItem>
                {focusedTaskId && (
                  <CommandItem onSelect={() => handleSelect("reschedule-tomorrow")}>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Reschedule to Tomorrow
                    <CommandShortcut>T</CommandShortcut>
                  </CommandItem>
                )}
              </CommandGroup>

              <CommandGroup heading="Navigation">
                <CommandItem onSelect={() => handleSelect("tasks")}>
                  <ListTodo className="mr-2 h-4 w-4" />
                  Go to Tasks
                  <CommandShortcut>G T</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("completed")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Go to Completed
                  <CommandShortcut>G C</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Go to Settings
                  <CommandShortcut>G S</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Account">
                <CommandItem onSelect={() => handleSelect("logout")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </CommandItem>
              </CommandGroup>
            </>
          )}

          {mode === "search" && <CommandEmpty>Press Enter to close</CommandEmpty>}

          {mode === "tags" && (
            <CommandGroup heading="Tags">
              <CommandItem onSelect={() => setMode("commands")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </CommandItem>
              {availableTags.map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => {
                    handleTagToggle(tag);
                    closeCommandBar();
                  }}
                  data-checked={selectedTags.includes(tag)}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  {tag}
                </CommandItem>
              ))}
              {availableTags.length === 0 && <CommandEmpty>No tags found</CommandEmpty>}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
