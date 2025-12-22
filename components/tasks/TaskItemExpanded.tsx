"use client";

import { useState } from "react";
import { Trash2, Calendar, ArrowRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toISODateString, parseDateString } from "@/lib/date";
import type { Task } from "@/features/tasks/types";

interface TaskItemExpandedProps {
  task: Task;
  onUpdateNotes: (id: string, notes: string) => void;
  onSchedule: (id: string, date: string | null) => void;
  onDelete: (id: string) => void;
  onToggleExpand?: () => void;
}

export function TaskItemExpanded({
  task,
  onUpdateNotes,
  onSchedule,
  onDelete,
  onToggleExpand,
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

  const getNextDayDate = () => {
    if (task.scheduledDate) {
      // If already scheduled, add 1 day to the scheduled date
      const currentDate = parseDateString(task.scheduledDate);
      currentDate.setDate(currentDate.getDate() + 1);
      return toISODateString(currentDate);
    } else {
      // If backlog, schedule for tomorrow
      return getDateString(1);
    }
  };

  const getNextWeekMondayDate = () => {
    // Start from the current scheduled date, or today if backlog
    const startDate = task.scheduledDate
      ? parseDateString(task.scheduledDate)
      : new Date();
    
    const date = new Date(startDate);
    const dayOfWeek = date.getDay();
    
    // Calculate days until next Monday from the start date
    // If today is Sunday (0), next Monday is 1 day away
    // If today is Monday (1), next Monday is 7 days away
    // Otherwise it's (8 - dayOfWeek) days away
    const daysUntilNextMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 7 : 8 - dayOfWeek;
    date.setDate(date.getDate() + daysUntilNextMonday);
    return toISODateString(date);
  };

  return (
    <div className="border-t px-3 pb-3 pt-2" onClick={(e) => e.stopPropagation()}>
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
