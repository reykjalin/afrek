"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import type { Value } from "platejs";
import { Button } from "@/components/ui/button";
import { WeeklyView } from "@/components/tasks";
import { UpgradeCTA } from "@/components/UpgradeCTA";
import { useTaskState } from "@/features/tasks/TaskStateContext";
import { TaskAccessProvider, useTaskAccess } from "@/features/billing";
import { useCommandBar } from "@/features/command-bar";
import { useTaskListKeyboard } from "@/hooks/useTaskListKeyboard";
import { getStartOfWeek, getTodayString, toISODateString } from "@/lib/date";
import { titleValueToText, textToTitleValue } from "@/components/editors/TitleEditor";
import type { Task, TaskPriority } from "@/features/tasks/types";

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  Highest: 0,
  High: 1,
  Medium: 2,
  Normal: 3,
  Low: 4,
  Lowest: 5,
};

function getWeekDays(startMonday: Date): string[] {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startMonday);
    date.setDate(startMonday.getDate() + i);
    days.push(toISODateString(date));
  }
  return days;
}

function TasksPageContent() {
  const { tasks, updateTask, deleteTask, toggleTaskDone, addTask } = useTaskState();
  const { readOnly, isLoading: isAccessLoading } = useTaskAccess();
  const { createTaskRequested, clearCreateTaskRequest } = useCommandBar();
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [createTaskDate, setCreateTaskDate] = useState<string | null>(null);
  const [newTaskTitleValue, setNewTaskTitleValue] = useState<Value>(textToTitleValue(""));
  const [newTaskTags, setNewTaskTags] = useState("");
  const [titleFocusKey, setTitleFocusKey] = useState(0);

  const visibleTaskIds = useMemo(() => {
    const weekDays = getWeekDays(weekStart);
    const ids: string[] = [];
    for (const date of weekDays) {
      const dayTasks = tasks
        .filter((task: Task) => task.scheduledDate === date)
        .sort((a: Task, b: Task) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
      ids.push(...dayTasks.map((t: Task) => t.id));
    }
    return ids;
  }, [tasks, weekStart]);

  useTaskListKeyboard({ taskIds: visibleTaskIds });

  const isCurrentWeek = useCallback(() => {
    const currentWeekStart = getStartOfWeek(new Date());
    return weekStart.toDateString() === currentWeekStart.toDateString();
  }, [weekStart]);

  const goToCurrentWeek = () => {
    setWeekStart(getStartOfWeek(new Date()));
  };

  const handleToggleDone = (id: string) => toggleTaskDone(id);

  const handleUpdateTitle = (id: string, titleJson: string) => {
    updateTask(id, { titleJson });
  };

  const handleUpdateNotes = (id: string, notesJson: string) => {
    updateTask(id, { notesJson });
  };

  const handleUpdateTags = (id: string, tags: string[]) => {
    updateTask(id, { tags });
  };

  const handleSchedule = (id: string, date: string | null) => {
    updateTask(id, {
      scheduledDate: date,
      status: date ? "scheduled" : "backlog",
    });
  };

  const handleDelete = (id: string) => deleteTask(id);

  const handleUpdatePriority = (id: string, priority: TaskPriority) => {
    updateTask(id, { priority });
  };

  useEffect(() => {
    if (createTaskRequested && !isCreatingTask) {
      setIsCreatingTask(true);
      setCreateTaskDate(getTodayString());
      clearCreateTaskRequest();
    }
  }, [createTaskRequested, isCreatingTask, clearCreateTaskRequest]);

  const handleCreateTask = async () => {
    const titleText = titleValueToText(newTaskTitleValue).trim();
    if (!titleText) {
      return;
    }
    const titleJson = JSON.stringify(newTaskTitleValue);
    const tags = newTaskTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    await addTask({
      titleJson,
      notesJson: "",
      titleText,
      notesText: "",
      tags,
      status: "scheduled",
      priority: "Normal",
      scheduledDate: createTaskDate ?? getTodayString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: "demo",
    });
    setNewTaskTitleValue(textToTitleValue(""));
    setNewTaskTags("");
    setTitleFocusKey((k) => k + 1);
  };

  const handleCancelCreate = () => {
    setNewTaskTitleValue(textToTitleValue(""));
    setNewTaskTags("");
    setIsCreatingTask(false);
    setCreateTaskDate(null);
  };

  const handleStartCreate = (date: string) => {
    setCreateTaskDate(date);
    setIsCreatingTask(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-4">
        {!isAccessLoading && readOnly && <UpgradeCTA />}

        {!isCurrentWeek() && (
          <div className="flex justify-center">
            <Button size="sm" onClick={goToCurrentWeek}>
              Go to current week
            </Button>
          </div>
        )}

        <WeeklyView
          tasks={tasks}
          weekStart={weekStart}
          onWeekChange={setWeekStart}
          onToggleDone={handleToggleDone}
          onUpdateTitle={handleUpdateTitle}
          onUpdateNotes={handleUpdateNotes}
          onUpdateTags={handleUpdateTags}
          onSchedule={handleSchedule}
          onDelete={handleDelete}
          onUpdatePriority={handleUpdatePriority}
          isCreatingTask={isCreatingTask}
          createTaskDate={createTaskDate}
          titleFocusKey={titleFocusKey}
          newTaskTitleValue={newTaskTitleValue}
          onNewTaskTitleChange={setNewTaskTitleValue}
          newTaskTags={newTaskTags}
          onNewTaskTagsChange={setNewTaskTags}
          onCreateTask={handleCreateTask}
          onCancelCreate={handleCancelCreate}
          onStartCreate={handleStartCreate}
        />
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <TaskAccessProvider>
      <TasksPageContent />
    </TaskAccessProvider>
  );
}
