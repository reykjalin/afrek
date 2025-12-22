export type TaskStatus = "backlog" | "scheduled" | "done";

export interface Task {
  id: string;
  title: string;
  notesMarkdown: string;
  tags: string[];
  status: TaskStatus;
  scheduledDate?: string; // ISO date string (YYYY-MM-DD)
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface CreateTaskInput {
  title: string;
  tags?: string[];
  scheduledDate?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  notesMarkdown?: string;
  tags?: string[];
  status?: TaskStatus;
  scheduledDate?: string | null;
}

export interface TaskFilters {
  view?: "all" | "backlog" | "week";
  weekStart?: string;
  search?: string;
  tags?: string[];
  status?: TaskStatus;
}
