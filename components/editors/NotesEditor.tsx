"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Value } from "platejs";
import { createSlateEditor } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { PlateStatic } from "platejs/static";

import { NotesEditorKit } from "@/components/editor/plugins/notes-editor-kit";
import { NotesEditorBaseKit } from "@/components/editor/plugins/notes-editor-base-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { cn } from "@/lib/utils";

const emptyValue: Value = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

interface NotesEditorProps {
  initialValue: Value | (() => Promise<Value>);
  onSave: (value: Value) => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
}

export function NotesEditor({
  initialValue,
  onSave,
  placeholder = "Add notes...",
  className,
  containerClassName,
}: NotesEditorProps) {
  const editor = usePlateEditor({
    plugins: NotesEditorKit,
    value: async () => {
      if (typeof initialValue === "function") {
        const value = await initialValue();
        return value.length > 0 ? value : emptyValue;
      }
      return initialValue.length > 0 ? initialValue : emptyValue;
    },
  });

  const lastSavedRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(() => {
    const currentJson = JSON.stringify(editor.children);
    if (lastSavedRef.current !== currentJson) {
      lastSavedRef.current = currentJson;
      onSave(editor.children as Value);
    }
  }, [editor, onSave]);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(save, 1000);
  }, [save]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      save();
    };
  }, [save]);

  const handleChange = useCallback(() => {
    debouncedSave();
  }, [debouncedSave]);

  const handleBlur = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save();
  }, [save]);

  return (
    <Plate editor={editor} onChange={handleChange}>
      <EditorContainer
        variant="default"
        className={cn("min-h-24 rounded-md border", containerClassName)}
        onBlur={handleBlur}
      >
        <Editor
          variant="none"
          className={cn("px-8 py-3 text-sm", className)}
          placeholder={placeholder}
        />
      </EditorContainer>
    </Plate>
  );
}

interface NotesEditorStaticProps {
  value: Value;
  className?: string;
  containerClassName?: string;
}

export function NotesEditorStatic({
  value,
  className,
  containerClassName,
}: NotesEditorStaticProps) {
  const editor = createSlateEditor({
    plugins: NotesEditorBaseKit,
    value: value.length > 0 ? value : emptyValue,
  });

  return (
    <div className={cn("min-h-24 rounded-md border", containerClassName)}>
      <PlateStatic
        editor={editor}
        className={cn("px-8 py-3 text-sm", className)}
      />
    </div>
  );
}
