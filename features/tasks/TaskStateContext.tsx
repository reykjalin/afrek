"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { Task } from "./types";

interface TaskStateContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskDone: (id: string) => void;
}

const TaskStateContext = createContext<TaskStateContextType | undefined>(undefined);

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review project proposal",
    notesMarkdown: "Check the budget section and timeline",
    tags: ["work", "urgent"],
    status: "scheduled",
    scheduledDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    userId: "demo",
  },
  {
    id: "2",
    title: "Buy groceries",
    notesMarkdown: "- Milk\n- Eggs\n- Bread",
    tags: ["personal"],
    status: "scheduled",
    scheduledDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now(),
    userId: "demo",
  },
  {
    id: "3",
    title: "Call dentist",
    notesMarkdown: "",
    tags: ["personal", "health"],
    status: "scheduled",
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now(),
    userId: "demo",
  },
  {
    id: "4",
    title: "Plan vacation",
    notesMarkdown: "Look into flights to Iceland",
    tags: ["personal"],
    status: "backlog",
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now(),
    userId: "demo",
  },
  {
    id: "5",
    title: "Update resume",
    notesMarkdown: "",
    tags: ["work"],
    status: "backlog",
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now(),
    userId: "demo",
  },
  {
    id: "6",
    title: "Read chapter 5",
    notesMarkdown: "The Design of Everyday Things",
    tags: ["reading"],
    status: "done",
    scheduledDate: new Date().toISOString().split('T')[0],
    completedAt: Date.now() - 86400000,
    createdAt: Date.now() - 518400000,
    updatedAt: Date.now(),
    userId: "demo",
  },
];

export function TaskStateProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTaskDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "done" ? (task.scheduledDate ? "scheduled" : "backlog") : "done",
              completedAt: task.status === "done" ? undefined : Date.now(),
              updatedAt: Date.now(),
            }
          : task
      )
    );
  }, []);

  return (
    <TaskStateContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskDone,
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
