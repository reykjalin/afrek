export type TaskStatus = "backlog" | "scheduled" | "done";
export type TaskPriority = "Lowest" | "Low" | "Normal" | "Medium" | "High" | "Highest";

export interface Task {
  id: string;
  title: string;
  notesJson: string;
  tags: string[];
  status: TaskStatus;
  priority: TaskPriority;
  scheduledDate?: string; // ISO date string (YYYY-MM-DD)
  completedAt?: number; // timestamp when task was marked as done
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface CreateTaskInput {
  title: string;
  tags?: string[];
  scheduledDate?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  notesJson?: string;
  tags?: string[];
  status?: TaskStatus;
  priority?: TaskPriority;
  scheduledDate?: string | null;
}

export interface TaskFilters {
  view?: "all" | "backlog" | "week";
  weekStart?: string;
  search?: string;
  tags?: string[];
  status?: TaskStatus;
}
