"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TopNavActionsContextType {
  leftContent?: ReactNode;
  setLeftContent: (content: ReactNode | undefined) => void;
}

const TopNavActionsContext = createContext<TopNavActionsContextType | undefined>(undefined);

export function TopNavActionsProvider({ children }: { children: ReactNode }) {
  const [leftContent, setLeftContent] = useState<ReactNode | undefined>(undefined);

  return (
    <TopNavActionsContext.Provider value={{ leftContent, setLeftContent }}>
      {children}
    </TopNavActionsContext.Provider>
  );
}

export function useTopNavActions() {
  const context = useContext(TopNavActionsContext);
  if (!context) {
    throw new Error("useTopNavActions must be used within TopNavActionsProvider");
  }
  return context;
}
