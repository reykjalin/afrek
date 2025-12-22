// Convex API wrappers for tasks
// This file will wrap Convex queries and mutations once Convex is integrated (Phase 2)

import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from "./types";

// Placeholder exports - will be implemented in Phase 2
export function useTasksQuery(filters: TaskFilters): Task[] | undefined {
  void filters; // Will be used when Convex is integrated
  // Will use: useQuery(api.tasks.listTasks, { userId, ...filters })
  return undefined;
}

export function useCreateTask(): (input: CreateTaskInput) => Promise<void> {
  // Will use: useMutation(api.tasks.createTask)
  return async () => {};
}

export function useUpdateTask(): (input: UpdateTaskInput) => Promise<void> {
  // Will use: useMutation(api.tasks.updateTask)
  return async () => {};
}

export function useDeleteTask(): (id: string) => Promise<void> {
  // Will use: useMutation(api.tasks.deleteTask)
  return async () => {};
}

export function useToggleDone(): (id: string) => Promise<void> {
  // Will use: useMutation(api.tasks.toggleDone)
  return async () => {};
}
