"use client";

import { useCallback } from "react";
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

  const handleChange = useCallback(
    ({ value }: { value: Value }) => {
      onChange(value);
    },
    [onChange]
  );

  return (
    <Plate editor={editor} onChange={handleChange} readOnly={readOnly}>
      <EditorContainer variant="default" className="min-h-24 rounded-md border">
        <Editor
          variant="none"
          className="px-3 py-2 text-sm"
          placeholder={placeholder}
        />
      </EditorContainer>
    </Plate>
  );
}
