"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TopNavActionsContextType {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  setLeftContent: (content: ReactNode | undefined) => void;
  setRightContent: (content: ReactNode | undefined) => void;
}

const TopNavActionsContext = createContext<TopNavActionsContextType | undefined>(undefined);

export function TopNavActionsProvider({ children }: { children: ReactNode }) {
  const [leftContent, setLeftContent] = useState<ReactNode | undefined>(undefined);
  const [rightContent, setRightContent] = useState<ReactNode | undefined>(undefined);

  return (
    <TopNavActionsContext.Provider value={{ leftContent, rightContent, setLeftContent, setRightContent }}>
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
