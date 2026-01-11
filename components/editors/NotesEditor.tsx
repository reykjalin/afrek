"use client";

import { useCallback } from "react";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { NotesEditorKit } from "@/components/editor/plugins/notes-editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";

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

const DEBOUNCE_DELAY = 100;

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

  const debouncedOnChange = useDebouncedCallback(onChange, DEBOUNCE_DELAY);

  const handleChange = useCallback(
    ({ value }: { value: Value }) => {
      debouncedOnChange(value);
    },
    [debouncedOnChange]
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
