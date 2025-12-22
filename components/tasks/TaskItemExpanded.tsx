"use client";

import { useState } from "react";
import { Trash2, Calendar, ArrowRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toISODateString } from "@/lib/date";
import type { Task } from "@/features/tasks/types";

interface TaskItemExpandedProps {
  task: Task;
  onUpdateNotes: (id: string, notes: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onDelete: (id: string) => void;
}

export function TaskItemExpanded({
  task,
  onUpdateNotes,
  onSchedule,
  onDelete,
}: TaskItemExpandedProps) {
  const [notes, setNotes] = useState(task.notesMarkdown);

  const handleNotesBlur = () => {
    if (notes !== task.notesMarkdown) {
      onUpdateNotes(task.id, notes);
    }
  };

  const getDateString = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return toISODateString(date);
  };

  const getEndOfWeekDate = () => {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    date.setDate(date.getDate() + daysUntilSunday);
    return toISODateString(date);
  };

  return (
    <div className="border-t px-3 pb-3 pt-2">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleNotesBlur}
        placeholder="Add notes..."
        className="min-h-24 resize-none"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Schedule:
        </span>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onSchedule(task.id, getDateString(0))}
        >
          <Calendar className="h-3 w-3" />
          Today
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onSchedule(task.id, getDateString(1))}
        >
          <ArrowRight className="h-3 w-3" />
          Tomorrow
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onSchedule(task.id, getEndOfWeekDate())}
        >
          <Calendar className="h-3 w-3" />
          This Week
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
