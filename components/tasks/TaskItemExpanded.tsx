"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Trash2, Calendar, ArrowRight, Inbox } from "lucide-react";
import type { Value } from "platejs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotesEditor } from "@/components/editors/NotesEditor";
import { toISODateString, parseDateString } from "@/lib/date";
import type { Task } from "@/features/tasks/types";

interface TaskItemExpandedProps {
  task: Task;
  onUpdateNotes: (id: string, notesJson: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  onSchedule: (id: string, date: string | null) => void;
  onDelete: (id: string) => void;
}

const emptyValue: Value = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

function parseNotesJson(notesJson: string): Value {
  if (!notesJson || notesJson.trim() === "") {
    return emptyValue;
  }
  try {
    const parsed = JSON.parse(notesJson);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : emptyValue;
  } catch {
    return emptyValue;
  }
}

export function TaskItemExpanded({
  task,
  onUpdateNotes,
  onUpdateTags,
  onSchedule,
  onDelete,
}: TaskItemExpandedProps) {
  const [tags, setTags] = useState(task.tags.join(", "));
  const [notesValue, setNotesValue] = useState<Value>(() =>
    parseNotesJson(task.notesJson)
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNotesChange = useCallback(
    (value: Value) => {
      setNotesValue(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const json = JSON.stringify(value);
        onUpdateNotes(task.id, json);
      }, 500);
    },
    [onUpdateNotes, task.id]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleTagsBlur = () => {
    const newTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const oldTags = task.tags;
    if (JSON.stringify(newTags) !== JSON.stringify(oldTags)) {
      onUpdateTags(task.id, newTags);
    }
  };

  const getDateString = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return toISODateString(date);
  };

  const getNextDayDate = () => {
    if (task.scheduledDate) {
      const currentDate = parseDateString(task.scheduledDate);
      currentDate.setDate(currentDate.getDate() + 1);
      return toISODateString(currentDate);
    } else {
      return getDateString(1);
    }
  };

  const getNextWeekMondayDate = () => {
    const startDate = task.scheduledDate
      ? parseDateString(task.scheduledDate)
      : new Date();

    const date = new Date(startDate);
    const dayOfWeek = date.getDay();

    const daysUntilNextMonday =
      dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 7 : 8 - dayOfWeek;
    date.setDate(date.getDate() + daysUntilNextMonday);
    return toISODateString(date);
  };

  return (
    <div
      className="border-t px-3 pb-3 pt-2 space-y-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-notes">Notes</Label>
        <NotesEditor
          value={notesValue}
          onChange={handleNotesChange}
          placeholder="Add notes..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-tags">Tags</Label>
        <Input
          id="task-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          onBlur={handleTagsBlur}
          placeholder="Tags (comma-separated)..."
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Schedule:
        </span>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onSchedule(task.id, getNextDayDate())}
        >
          <ArrowRight className="h-3 w-3" />
          Next day
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onSchedule(task.id, getNextWeekMondayDate())}
        >
          <Calendar className="h-3 w-3" />
          Next week
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onSchedule(task.id, null)}
        >
          <Inbox className="h-3 w-3" />
          Backlog
        </Button>

        <div className="flex-1" />

        <Button
          variant="destructive"
          size="xs"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}
