"use client";

import { createContext, useContext } from "react";
import { useIsSubscribed } from "./hooks";

type TaskAccessContextValue = {
  readOnly: boolean;
  isLoading: boolean;
};

const TaskAccessContext = createContext<TaskAccessContextValue>({
  readOnly: true,
  isLoading: true,
});

export function useTaskAccess() {
  return useContext(TaskAccessContext);
}

type Props = {
  children: React.ReactNode;
};

export function TaskAccessProvider({ children }: Props) {
  const isSubscribed = useIsSubscribed();
  const isLoading = isSubscribed === undefined;

  return (
    <TaskAccessContext.Provider value={{ readOnly: !isSubscribed, isLoading }}>
      {children}
    </TaskAccessContext.Provider>
  );
}
