"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TaskFocusContextType {
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;
}

const TaskFocusContext = createContext<TaskFocusContextType | undefined>(undefined);

export function TaskFocusProvider({ children }: { children: ReactNode }) {
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  return (
    <TaskFocusContext.Provider value={{ focusedTaskId, setFocusedTaskId }}>
      {children}
    </TaskFocusContext.Provider>
  );
}

export function useTaskFocus() {
  const context = useContext(TaskFocusContext);
  if (!context) {
    throw new Error("useTaskFocus must be used within TaskFocusProvider");
  }
  return context;
}
