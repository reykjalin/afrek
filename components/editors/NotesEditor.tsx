"use client";

import { useCallback, useRef, useEffect } from "react";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { NotesEditorKit } from "@/components/editor/plugins/notes-editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";

interface NotesEditorProps {
  value: Value;
  onChange: (value: Value) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const emptyValue: Value = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

export function NotesEditor({
  value,
  onChange,
  placeholder = "Add notes...",
  readOnly = false,
}: NotesEditorProps) {
  const editor = usePlateEditor({
    plugins: NotesEditorKit,
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

  const handleChange = useCallback(
    ({ value }: { value: Value }) => {
      editorValueRef.current = JSON.stringify(value);
      onChange(value);
    },
    [onChange]
  );

  return (
    <Plate editor={editor} onChange={handleChange} readOnly={readOnly}>
      <EditorContainer variant="default" className="min-h-24 rounded-md border">
        <Editor
          variant="none"
          className="px-8 py-3 text-sm"
          placeholder={placeholder}
        />
      </EditorContainer>
    </Plate>
  );
}
