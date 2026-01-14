export type TaskStatus = "scheduled" | "done";
export type TaskPriority = "Lowest" | "Low" | "Normal" | "Medium" | "High" | "Highest";

export interface Task {
  id: string;
  titleJson: string; // Rich text Plate.js JSON value
  notesJson: string;
  titleText: string; // Plain text for search
  notesText: string; // Plain text for search
  tags: string[];
  status: TaskStatus;
  priority: TaskPriority;
  scheduledDate?: string; // ISO date string (YYYY-MM-DD)
  completedAt?: number; // timestamp when task was marked as done
  createdAt: number;
  updatedAt: number;
  userId: string;
  isLocked?: boolean; // true when task is encrypted but key is not available
}

export interface CreateTaskInput {
  titleJson: string; // Rich text JSON
  tags?: string[];
  scheduledDate?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskInput {
  id: string;
  titleJson?: string; // Rich text JSON
  notesJson?: string;
  tags?: string[];
  status?: TaskStatus;
  priority?: TaskPriority;
  scheduledDate?: string | null;
}

export interface TaskFilters {
  view?: "all" | "week";
  weekStart?: string;
  search?: string;
  tags?: string[];
  status?: TaskStatus;
}
