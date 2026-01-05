"use client";

import { createContext, useContext } from "react";
import { Protect } from "@clerk/nextjs";

type TaskAccessContextValue = {
  readOnly: boolean;
};

const TaskAccessContext = createContext<TaskAccessContextValue>({
  readOnly: true,
});

export function useTaskAccess() {
  return useContext(TaskAccessContext);
}

type Props = {
  children: React.ReactNode;
};

export function TaskAccessProvider({ children }: Props) {
  return (
    <Protect
      plan="premium"
      // condition={(has) =>
      //   has({ plan: "premium" }) || has({ plan: "free_user" })
      // }
      fallback={
        <TaskAccessContext.Provider value={{ readOnly: true }}>
          {children}
        </TaskAccessContext.Provider>
      }
    >
      <TaskAccessContext.Provider value={{ readOnly: false }}>
        {children}
      </TaskAccessContext.Provider>
    </Protect>
  );
}
