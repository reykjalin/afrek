"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTaskFocus } from "@/features/tasks/TaskFocusContext";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { useCommandBar } from "@/features/command-bar";
import { useKeyboard } from "@/features/keyboard";
import { isEditableElement } from "@/lib/keyboard";
import { addDays } from "date-fns";
import { toISODateString } from "@/lib/date";

interface UseTaskListKeyboardOptions {
  taskIds: string[];
  onOpenRescheduler?: (taskId: string) => void;
  onOpenPriorityPicker?: (taskId: string) => void;
}

export function useTaskListKeyboard({ 
  taskIds,
  onOpenRescheduler,
  onOpenPriorityPicker,
}: UseTaskListKeyboardOptions) {
  const router = useRouter();
  const { focusedTaskId, setFocusedTaskId } = useTaskFocus();
  const { toggleTaskDone, updateTask } = useTaskState();
  const { open: commandBarOpen } = useCommandBar();
  const { pendingKey } = useKeyboard();

  const moveFocus = useCallback((direction: "up" | "down") => {
    if (taskIds.length === 0) return;
    
    const currentIndex = focusedTaskId ? taskIds.indexOf(focusedTaskId) : -1;
    
    if (direction === "down") {
      const nextIndex = currentIndex < taskIds.length - 1 ? currentIndex + 1 : 0;
      setFocusedTaskId(taskIds[nextIndex]);
    } else {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : taskIds.length - 1;
      setFocusedTaskId(taskIds[prevIndex]);
    }
  }, [taskIds, focusedTaskId, setFocusedTaskId]);

  useEffect(() => {
    if (focusedTaskId && !taskIds.includes(focusedTaskId)) {
      setFocusedTaskId(null);
    }
  }, [taskIds, focusedTaskId, setFocusedTaskId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if command bar is open, in editable element, or there's a pending key sequence
      if (commandBarOpen) return;
      if (isEditableElement(e.target)) return;
      if (pendingKey) return; // Don't handle if we're in a key sequence like 'g'

      switch (e.key) {
        case "ArrowDown":
        case "j":
          e.preventDefault();
          moveFocus("down");
          break;
        
        case "ArrowUp":
        case "k":
          e.preventDefault();
          moveFocus("up");
          break;
        
        case "Enter":
        case "e":
          if (focusedTaskId) {
            e.preventDefault();
            router.push(`/tasks/${focusedTaskId}`);
          }
          break;
        
        case "c":
          if (focusedTaskId) {
            e.preventDefault();
            toggleTaskDone(focusedTaskId);
          }
          break;
        
        case "r":
          if (focusedTaskId && onOpenRescheduler) {
            e.preventDefault();
            onOpenRescheduler(focusedTaskId);
          }
          break;
        
        case "t":
          if (focusedTaskId) {
            e.preventDefault();
            const tomorrow = addDays(new Date(), 1);
            updateTask(focusedTaskId, { 
              scheduledDate: toISODateString(tomorrow),
              status: "scheduled"
            });
          }
          break;
        
        case "p":
          if (focusedTaskId && onOpenPriorityPicker) {
            e.preventDefault();
            onOpenPriorityPicker(focusedTaskId);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandBarOpen, focusedTaskId, moveFocus, router, toggleTaskDone, updateTask, onOpenRescheduler, onOpenPriorityPicker, pendingKey]);

  return { focusedTaskId, setFocusedTaskId };
}
