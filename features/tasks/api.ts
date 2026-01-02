"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { TaskStatus } from "./types";

export function useTasksQuery(
  userId: string | undefined,
  filters?: {
    search?: string;
    tags?: string[];
    status?: TaskStatus;
  }
) {
  return useQuery(
    api.tasks.listTasks,
    userId
      ? {
          userId,
          search: filters?.search,
          tags: filters?.tags,
          status: filters?.status,
        }
      : "skip"
  );
}

export function useTaskQuery(id: Id<"tasks">) {
  return useQuery(api.tasks.getTask, { id });
}

export function useCreateTask() {
  return useMutation(api.tasks.createTask);
}

export function useUpdateTask() {
  return useMutation(api.tasks.updateTask);
}

export function useToggleDone() {
  return useMutation(api.tasks.toggleDone);
}

export function useDeleteTask() {
  return useMutation(api.tasks.deleteTask);
}
