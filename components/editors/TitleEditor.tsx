"use client";

import { useCallback, useEffect } from "react";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { TitleEditorKit } from "@/components/editor/plugins/title-editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";

interface TitleEditorProps {
  value: Value;
  onChange: (value: Value) => void;
  placeholder?: string;
  readOnly?: boolean;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
  className?: string;
  containerClassName?: string;
}

const emptyValue: Value = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

export function TitleEditor({
  value,
  onChange,
  placeholder = "Task title...",
  readOnly = false,
  onBlur,
  onKeyDown,
  autoFocus = false,
  className,
  containerClassName,
}: TitleEditorProps) {
  const editor = usePlateEditor({
    plugins: TitleEditorKit,
    value: value.length > 0 ? value : emptyValue,
  });

  useEffect(() => {
    if (autoFocus) {
      editor.tf.focus({ edge: "end" });
    }
  }, [autoFocus, editor]);

  const debouncedOnChange = useDebouncedCallback(onChange);

  const handleChange = useCallback(
    ({ value }: { value: Value }) => {
      debouncedOnChange(value);
    },
    [debouncedOnChange]
  );

  return (
    <Plate editor={editor} onChange={handleChange} readOnly={readOnly}>
      <EditorContainer
        variant="default"
        className={cn("min-h-0 rounded-md", containerClassName)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <Editor
          variant="none"
          className={cn("px-0 py-0 text-sm leading-tight", className)}
          placeholder={placeholder}
        />
      </EditorContainer>
    </Plate>
  );
}

/**
 * Utility to convert plain text to Plate.js Value format
 */
export function textToTitleValue(text: string): Value {
  if (!text) {
    return [{ type: "p", children: [{ text: "" }] }];
  }
  return [{ type: "p", children: [{ text }] }];
}

/**
 * Utility to extract plain text from Plate.js Value format
 * This is useful for search indexing and display in contexts where rich text isn't supported
 */
export function titleValueToText(value: Value): string {
  if (!value || value.length === 0) {
    return "";
  }

  const extractText = (node: unknown): string => {
    if (typeof node === "object" && node !== null) {
      const nodeObj = node as Record<string, unknown>;
      if ("text" in nodeObj && typeof nodeObj.text === "string") {
        return nodeObj.text;
      }
      if ("children" in nodeObj && Array.isArray(nodeObj.children)) {
        return nodeObj.children.map(extractText).join("");
      }
    }
    return "";
  };

  return value.map(extractText).join("\n");
}
