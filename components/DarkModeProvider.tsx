"use client";

import { useDarkMode } from "@/hooks/useDarkMode";

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  useDarkMode();
  return <>{children}</>;
}
