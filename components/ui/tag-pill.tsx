"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagPillProps {
  tag: string;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function TagPill({ tag, onClick, onRemove, className }: TagPillProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-muted-foreground/30 bg-transparent px-2 py-0 text-[10px] font-normal hover:bg-muted/60",
        onClick && "cursor-pointer",
        onRemove && "gap-1",
        className
      )}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </Badge>
  );
}
