"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { TaskStatus, TaskPriority } from "./types";

export const DEMO_USER_ID = "demo";

// Query hook for listing tasks
export function useTasksQuery(filters?: {
  search?: string;
  tags?: string[];
  status?: TaskStatus;
}) {
  return useQuery(api.tasks.listTasks, {
    userId: DEMO_USER_ID,
    search: filters?.search,
    tags: filters?.tags,
    status: filters?.status,
  });
}

// Query hook for single task
export function useTaskQuery(id: Id<"tasks">) {
  return useQuery(api.tasks.getTask, { id });
}

// Mutation hooks
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
