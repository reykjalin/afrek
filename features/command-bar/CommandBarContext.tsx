"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type CommandBarMode = "commands" | "search" | "tags";

interface CommandBarContextType {
  open: boolean;
  mode: CommandBarMode;
  focusedTaskId: string | null;
  createTaskRequested: boolean;
  openCommandBar: () => void;
  closeCommandBar: () => void;
  setMode: (mode: CommandBarMode) => void;
  setFocusedTaskId: (id: string | null) => void;
  requestCreateTask: () => void;
  clearCreateTaskRequest: () => void;
}

const CommandBarContext = createContext<CommandBarContextType | undefined>(
  undefined
);

export function CommandBarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setModeState] = useState<CommandBarMode>("commands");
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const [createTaskRequested, setCreateTaskRequested] = useState(false);

  const openCommandBar = useCallback(() => {
    setModeState("commands");
    setOpen(true);
  }, []);

  const closeCommandBar = useCallback(() => {
    setOpen(false);
  }, []);

  const setMode = useCallback((newMode: CommandBarMode) => {
    setModeState(newMode);
  }, []);

  const requestCreateTask = useCallback(() => {
    setCreateTaskRequested(true);
    setOpen(false);
  }, []);

  const clearCreateTaskRequest = useCallback(() => {
    setCreateTaskRequested(false);
  }, []);

  return (
    <CommandBarContext.Provider
      value={{
        open,
        mode,
        focusedTaskId,
        createTaskRequested,
        openCommandBar,
        closeCommandBar,
        setMode,
        setFocusedTaskId,
        requestCreateTask,
        clearCreateTaskRequest,
      }}
    >
      {children}
    </CommandBarContext.Provider>
  );
}

export function useCommandBar() {
  const context = useContext(CommandBarContext);
  if (!context) {
    throw new Error("useCommandBar must be used within CommandBarProvider");
  }
  return context;
}
