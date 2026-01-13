"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCommandBar } from "@/features/command-bar";
import { useKeyboard } from "@/features/keyboard";
import { isEditableElement } from "@/lib/keyboard";

export function useGlobalShortcuts() {
  const router = useRouter();
  const { openCommandBar, requestCreateTask } = useCommandBar();
  const { pendingKey, setPendingKey, startKeySequence } = useKeyboard();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K always opens command bar (even in inputs)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommandBar();
        return;
      }

      // Skip other shortcuts when typing in editable elements
      if (isEditableElement(e.target)) {
        return;
      }

      // Handle g-prefixed shortcuts (g t, g c, g s)
      if (pendingKey === "g") {
        setPendingKey(null);

        switch (e.key.toLowerCase()) {
          case "t":
            e.preventDefault();
            e.stopImmediatePropagation();
            router.push("/tasks");
            return;
          case "c":
            e.preventDefault();
            e.stopImmediatePropagation();
            router.push("/completed");
            return;
          case "s":
            e.preventDefault();
            e.stopImmediatePropagation();
            router.push("/settings");
            return;
        }
      }

      // Start g sequence
      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        startKeySequence("g", 1000);
        return;
      }

      // N key for new task
      if (e.key === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        requestCreateTask();
        return;
      }
    };

    // Use capture phase to handle before other listeners
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [openCommandBar, requestCreateTask, router, pendingKey, setPendingKey, startKeySequence]);
}
