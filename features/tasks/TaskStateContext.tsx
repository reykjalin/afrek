"use client";

import { createContext, useContext, useState, useMemo, ReactNode, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import type { Task, UpdateTaskInput } from "./types";
import {
  useTasksQuery,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleDone,
} from "./api";
import { useTaskFilter } from "./TaskFilterContext";
import type { Id } from "@/convex/_generated/dataModel";

interface TaskStateContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: string, updates: Omit<UpdateTaskInput, "id">) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskDone: (id: string) => Promise<void>;
  expandedTaskIds: Set<string>;
  toggleTaskExpanded: (id: string) => void;
}

const TaskStateContext = createContext<TaskStateContextType | undefined>(undefined);

export function TaskStateProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const { filters } = useTaskFilter();
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());

  const tasksData = useTasksQuery(userId ?? undefined, {
    search: filters.search,
    tags: filters.tags,
    status: filters.status,
  });
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleDoneMutation = useToggleDone();

  const tasks = useMemo<Task[]>(() => {
    if (!tasksData) return [];
    return tasksData.map((t) => ({
      id: t._id,
      title: t.title,
      notesMarkdown: t.notesMarkdown,
      tags: t.tags,
      status: t.status,
      priority: t.priority,
      scheduledDate: t.scheduledDate,
      completedAt: t.completedAt,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      userId: t.userId,
    }));
  }, [tasksData]);

  const isLoading = tasksData === undefined;

  const addTask = useCallback(
    async (task: Omit<Task, "id">) => {
      if (!userId) return;
      await createTaskMutation({
        userId,
        title: task.title,
        tags: task.tags,
        scheduledDate: task.scheduledDate,
        priority: task.priority,
      });
    },
    [createTaskMutation, userId]
  );

  const updateTask = useCallback(
    async (id: string, updates: Omit<UpdateTaskInput, "id">) => {
      await updateTaskMutation({
        id: id as Id<"tasks">,
        title: updates.title,
        notesMarkdown: updates.notesMarkdown,
        tags: updates.tags,
        status: updates.status,
        priority: updates.priority,
        scheduledDate: updates.scheduledDate,
      });
    },
    [updateTaskMutation]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await deleteTaskMutation({ id: id as Id<"tasks"> });
    },
    [deleteTaskMutation]
  );

  const toggleTaskDone = useCallback(
    async (id: string) => {
      await toggleDoneMutation({ id: id as Id<"tasks"> });
    },
    [toggleDoneMutation]
  );

  const toggleTaskExpanded = useCallback((id: string) => {
    setExpandedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <TaskStateContext.Provider
      value={{
        tasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskDone,
        expandedTaskIds,
        toggleTaskExpanded,
      }}
    >
      {children}
    </TaskStateContext.Provider>
  );
}

export function useTaskState() {
  const context = useContext(TaskStateContext);
  if (!context) {
    throw new Error("useTaskState must be used within TaskStateProvider");
  }
  return context;
}
