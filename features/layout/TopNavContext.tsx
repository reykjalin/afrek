"use client";

import { createContext, useContext, ReactNode } from "react";

interface TopNavContextType {
  leftContent?: ReactNode;
}

const TopNavContext = createContext<TopNavContextType>({});

export function TopNavProvider({ children, leftContent }: { children: ReactNode; leftContent?: ReactNode }) {
  return (
    <TopNavContext.Provider value={{ leftContent }}>
      {children}
    </TopNavContext.Provider>
  );
}

export function useTopNav() {
  return useContext(TopNavContext);
}
