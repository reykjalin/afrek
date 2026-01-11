"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useCurrentUser } from "@/features/auth/hooks";
import { toast } from "sonner";
import type { Task, UpdateTaskInput } from "./types";
import {
  useTasksQuery,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleDone,
} from "./api";
import { useTaskFilter } from "./TaskFilterContext";
import { useEncryption } from "@/features/crypto";
import {
  encryptJson,
  decryptJson,
  type EncryptedBlob,
  type EncryptedTaskPayload,
} from "@/lib/crypto";
import { richTextJsonToText } from "@/lib/richText";
import type { Id } from "@/convex/_generated/dataModel";

interface TaskStateContextType {
  tasks: Task[];
  isLoading: boolean;
  readOnly: boolean;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (
    id: string,
    updates: Omit<UpdateTaskInput, "id">,
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskDone: (id: string) => Promise<void>;
  expandedTaskIds: Set<string>;
  toggleTaskExpanded: (id: string) => void;
}

const TaskStateContext = createContext<TaskStateContextType | undefined>(
  undefined,
);

export function TaskStateProvider({ children }: { children: ReactNode }) {
  const { userId } = useCurrentUser();
  const { filters } = useTaskFilter();
  const { enabled: encryptionEnabled, key, locked: encryptionLocked } = useEncryption();
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(
    new Set(),
  );
  const [decryptedCache, setDecryptedCache] = useState<
    Map<string, EncryptedTaskPayload>
  >(new Map());

  const tasksData = useTasksQuery(userId ?? undefined, {
    search: encryptionEnabled ? undefined : filters.search,
    tags: encryptionEnabled ? undefined : filters.tags,
    status: filters.status,
  });
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleDoneMutation = useToggleDone();

  useEffect(() => {
    if (!tasksData || !key) return;

    const decryptTasks = async () => {
      const newCache = new Map<string, EncryptedTaskPayload>();
      for (const task of tasksData) {
        if (task.encryptedPayload) {
          try {
            const blob: EncryptedBlob = JSON.parse(task.encryptedPayload);
            const decrypted = await decryptJson<EncryptedTaskPayload>(key, blob);
            newCache.set(task._id, decrypted);
          } catch (e) {
            console.error("Failed to decrypt task:", task._id, e);
          }
        }
      }
      setDecryptedCache(newCache);
    };

    decryptTasks();
  }, [tasksData, key]);

  const tasks = useMemo<Task[]>(() => {
    if (!tasksData) return [];

    let result = tasksData.map((t) => {
      const decrypted = decryptedCache.get(t._id);
      const isLocked = !!t.encryptedPayload && !decrypted;

      return {
        id: t._id,
        titleJson: decrypted?.titleJson ?? (isLocked ? "" : (t.titleJson ?? "")),
        notesJson: decrypted?.notesJson ?? (isLocked ? "" : t.notesJson),
        titleText: decrypted?.titleText ?? (isLocked ? "" : (t.titleText ?? "")),
        notesText: decrypted?.notesText ?? (isLocked ? "" : (t.notesText ?? "")),
        tags: decrypted?.tags ?? (isLocked ? [] : t.tags),
        status: t.status,
        priority: t.priority,
        scheduledDate: t.scheduledDate,
        completedAt: t.completedAt,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        userId: t.userId,
        isLocked,
      };
    });

    if (encryptionEnabled && !encryptionLocked) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (t) =>
            t.titleText.toLowerCase().includes(q) ||
            t.notesText.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        result = result.filter((t) =>
          t.tags.some((tag) => filters.tags!.includes(tag))
        );
      }
    }

    return result;
  }, [tasksData, decryptedCache, encryptionEnabled, encryptionLocked, filters]);

  const isLoading = tasksData === undefined;
  const readOnly = encryptionEnabled && encryptionLocked;

  const handleMutationError = (error: unknown, action: string) => {
    const message = error instanceof Error ? error.message : String(error);
    
    if (message.includes("Unauthenticated") || message.includes("User not found")) {
      toast.error("Please sign in to manage tasks", {
        description: "Your session may have expired. Try refreshing the page.",
      });
    } else if (message.includes("Subscription required") || message.includes("subscription")) {
      toast.error("Subscription required", {
        description: "Upgrade your plan to manage tasks.",
        action: {
          label: "View Plans",
          onClick: () => window.location.href = "/pricing",
        },
      });
    } else {
      toast.error(`Failed to ${action}`, {
        description: message,
      });
    }
  };

  const addTask = useCallback(
    async (task: Omit<Task, "id">) => {
      if (!userId) return;
      if (readOnly) {
        toast.error("Cannot create tasks", {
          description: "Unlock encryption to create tasks.",
        });
        return;
      }
      if (encryptionEnabled && !key) {
        toast.error("Cannot create tasks", {
          description: "Encryption key not available.",
        });
        return;
      }
      try {
        const titleJson = task.titleJson ?? "";
        const notesJson = task.notesJson ?? "";
        const titleText = richTextJsonToText(titleJson);
        const notesText = richTextJsonToText(notesJson);

        if (encryptionEnabled && key) {
          const payload: EncryptedTaskPayload = {
            titleJson,
            notesJson,
            titleText,
            notesText,
            tags: task.tags,
          };
          const blob = await encryptJson(key, payload);
          await createTaskMutation({
            userId,
            titleJson: "",
            titleText: "",
            notesText: "",
            tags: [],
            scheduledDate: task.scheduledDate,
            priority: task.priority,
            encryptedPayload: JSON.stringify(blob),
          });
        } else {
          await createTaskMutation({
            userId,
            titleJson,
            titleText,
            notesText,
            tags: task.tags,
            scheduledDate: task.scheduledDate,
            priority: task.priority,
          });
        }
      } catch (error) {
        handleMutationError(error, "create task");
      }
    },
    [createTaskMutation, userId, encryptionEnabled, key, readOnly],
  );

  const updateTask = useCallback(
    async (id: string, updates: Omit<UpdateTaskInput, "id">) => {
      if (readOnly) {
        toast.error("Cannot update tasks", {
          description: "Unlock encryption to update tasks.",
        });
        return;
      }
      if (encryptionEnabled && !key) {
        toast.error("Cannot update tasks", {
          description: "Encryption key not available.",
        });
        return;
      }
      try {
        const existingTask = tasks.find((t) => t.id === id);
        if (!existingTask) return;

        const newTitleJson = updates.titleJson ?? existingTask.titleJson;
        const newNotesJson = updates.notesJson ?? existingTask.notesJson;
        const newTags = updates.tags ?? existingTask.tags;
        const titleText = richTextJsonToText(newTitleJson);
        const notesText = richTextJsonToText(newNotesJson);

        if (encryptionEnabled && key) {
          const payload: EncryptedTaskPayload = {
            titleJson: newTitleJson,
            notesJson: newNotesJson,
            titleText,
            notesText,
            tags: newTags,
          };
          const blob = await encryptJson(key, payload);
          await updateTaskMutation({
            id: id as Id<"tasks">,
            titleJson: "",
            notesJson: "",
            titleText: "",
            notesText: "",
            tags: [],
            status: updates.status,
            priority: updates.priority,
            scheduledDate: updates.scheduledDate,
            encryptedPayload: JSON.stringify(blob),
          });
        } else {
          await updateTaskMutation({
            id: id as Id<"tasks">,
            titleJson: updates.titleJson,
            notesJson: updates.notesJson,
            titleText: updates.titleJson !== undefined ? titleText : undefined,
            notesText: updates.notesJson !== undefined ? notesText : undefined,
            tags: updates.tags,
            status: updates.status,
            priority: updates.priority,
            scheduledDate: updates.scheduledDate,
          });
        }
      } catch (error) {
        handleMutationError(error, "update task");
      }
    },
    [updateTaskMutation, encryptionEnabled, key, tasks, readOnly],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (readOnly) {
        toast.error("Cannot delete tasks", {
          description: "Unlock encryption to delete tasks.",
        });
        return;
      }
      try {
        await deleteTaskMutation({ id: id as Id<"tasks"> });
      } catch (error) {
        handleMutationError(error, "delete task");
      }
    },
    [deleteTaskMutation, readOnly],
  );

  const toggleTaskDone = useCallback(
    async (id: string) => {
      if (readOnly) {
        toast.error("Cannot update tasks", {
          description: "Unlock encryption to update tasks.",
        });
        return;
      }
      try {
        await toggleDoneMutation({ id: id as Id<"tasks"> });
      } catch (error) {
        handleMutationError(error, "update task");
      }
    },
    [toggleDoneMutation, readOnly],
  );

  const toggleTaskExpanded = useCallback((id: string) => {
    setExpandedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <TaskStateContext.Provider
      value={{
        tasks,
        isLoading,
        readOnly,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskDone,
        expandedTaskIds,
        toggleTaskExpanded,
      }}
    >
      {children}
    </TaskStateContext.Provider>
  );
}

export function useTaskState() {
  const context = useContext(TaskStateContext);
  if (!context) {
    throw new Error("useTaskState must be used within TaskStateProvider");
  }
  return context;
}
