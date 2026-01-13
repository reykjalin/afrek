"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

interface KeyboardContextType {
  pendingKey: string | null;
  setPendingKey: (key: string | null) => void;
  startKeySequence: (key: string, timeoutMs?: number) => void;
  clearKeySequence: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [pendingKey, setPendingKeyState] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearKeySequence = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPendingKeyState(null);
  }, []);

  const setPendingKey = useCallback((key: string | null) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPendingKeyState(key);
  }, []);

  const startKeySequence = useCallback((key: string, timeoutMs = 1000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setPendingKeyState(key);
    timeoutRef.current = setTimeout(() => {
      setPendingKeyState(null);
      timeoutRef.current = null;
    }, timeoutMs);
  }, []);

  return (
    <KeyboardContext.Provider value={{ pendingKey, setPendingKey, startKeySequence, clearKeySequence }}>
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard must be used within KeyboardProvider");
  }
  return context;
}
