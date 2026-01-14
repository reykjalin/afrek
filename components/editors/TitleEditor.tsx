"use client";

import { useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import type { Value } from "platejs";
import { createSlateEditor } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { PlateStatic } from "platejs/static";

import { TitleEditorKit } from "@/components/editor/plugins/title-editor-kit";
import { TitleEditorBaseKit } from "@/components/editor/plugins/title-editor-base-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { cn } from "@/lib/utils";

const emptyValue: Value = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

export interface TitleEditorRef {
  getValue: () => Value;
  getMarkdown: () => string;
  clear: () => void;
}

interface TitleEditorProps {
  initialValue: Value | (() => Promise<Value>);
  onSave: (value: Value) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
  className?: string;
  containerClassName?: string;
}

export const TitleEditor = forwardRef<TitleEditorRef, TitleEditorProps>(
  function TitleEditor(
    {
      initialValue,
      onSave,
      placeholder = "Task title...",
      onKeyDown,
      autoFocus = false,
      className,
      containerClassName,
    },
    ref
  ) {
    const editor = usePlateEditor({
      plugins: TitleEditorKit,
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

    useImperativeHandle(ref, () => ({
      getValue: () => editor.children as Value,
      getMarkdown: () => editor.api.markdown.serialize(),
      clear: () => {
        editor.tf.setValue(emptyValue);
        lastSavedRef.current = null;
      },
    }), [editor]);

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
      if (autoFocus) {
        editor.tf.focus({ edge: "end" });
      }
    }, [autoFocus, editor]);

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
          className={cn("min-h-0 rounded-md", containerClassName)}
          onBlur={handleBlur}
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
);

interface TitleEditorStaticProps {
  value: Value;
  className?: string;
  containerClassName?: string;
}

export function TitleEditorStatic({
  value,
  className,
  containerClassName,
}: TitleEditorStaticProps) {
  const editor = createSlateEditor({
    plugins: TitleEditorBaseKit,
    value: value.length > 0 ? value : emptyValue,
  });

  return (
    <div className={cn("min-h-0 rounded-md", containerClassName)}>
      <PlateStatic
        editor={editor}
        className={cn("px-0 py-0 text-sm leading-tight", className)}
      />
    </div>
  );
}

interface TitleEditorCreateProps {
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  className?: string;
  containerClassName?: string;
}

export const TitleEditorCreate = forwardRef<TitleEditorRef, TitleEditorCreateProps>(
  function TitleEditorCreate(
    {
      placeholder = "Task title...",
      onKeyDown,
      onBlur,
      autoFocus = false,
      className,
      containerClassName,
    },
    ref
  ) {
    const editor = usePlateEditor({
      plugins: TitleEditorKit,
      value: emptyValue,
    });

    useImperativeHandle(ref, () => ({
      getValue: () => editor.children as Value,
      getMarkdown: () => editor.api.markdown.serialize(),
      clear: () => {
        editor.tf.setValue(emptyValue);
      },
    }), [editor]);

    useEffect(() => {
      if (autoFocus) {
        editor.tf.focus({ edge: "end" });
      }
    }, [autoFocus, editor]);

    return (
      <Plate editor={editor}>
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
);

/**
 * Utility to convert plain text to Plate.js Value format
 */
export function textToTitleValue(text: string): Value {
  if (!text) {
    return [{ type: "p", children: [{ text: "" }] }];
  }
  return [{ type: "p", children: [{ text }] }];
}
