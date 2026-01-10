"use client";

import { useCallback, useRef, useEffect } from "react";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { TitleEditorKit } from "@/components/editor/plugins/title-editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { cn } from "@/lib/utils";

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

  const prevValueRef = useRef<string>(JSON.stringify(value));
  const editorValueRef = useRef<string>(JSON.stringify(value));

  useEffect(() => {
    const valueStr = JSON.stringify(value);
    // Only update editor if the external value changed AND it's different from
    // what the editor currently has (avoids resetting on our own edits)
    if (valueStr !== prevValueRef.current && valueStr !== editorValueRef.current) {
      editor.tf.setValue(value.length > 0 ? value : emptyValue);
      editorValueRef.current = valueStr;
    }
    prevValueRef.current = valueStr;
  }, [value, editor]);

  useEffect(() => {
    if (autoFocus) {
      // Focus at the end of the content
      editor.tf.focus({ edge: 'end' });
    }
  }, [autoFocus, editor]);

  const handleChange = useCallback(
    ({ value }: { value: Value }) => {
      editorValueRef.current = JSON.stringify(value);
      onChange(value);
    },
    [onChange]
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
  
  // Recursively extract text from all nodes
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
