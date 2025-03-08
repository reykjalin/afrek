import { useState, useEffect } from "react";
import { useSyncedEditor } from "@verdant-web/tiptap/react";
import { EditorContent, FloatingMenu, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { hooks, Note } from "@/store.js";
import { bulletList } from "@tiptap/pm/schema-list";

export interface HomePageProps {}

function NoteEditor({ note }: { note: Note }) {
  const editor = useSyncedEditor(note, "content", {
    editorOptions: {
      extensions: [StarterKit],
    },
  });

  return (
    <>
      <EditorContent
        className="prose m-5 prose-p:m-0 prose-li:m-0 focus:outline-none *:focus-visible:outline-none mx-auto"
        editor={editor}
      />
    </>
  );
}

export function HomePage({}: HomePageProps) {
  const now = new Date();
  const note = hooks.useNote("a132ywalj5eas9a2rcoynwnc");

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-xl">{now.getFullYear()}</h1>

      <NoteEditor note={note} />
    </div>
  );
}

export default HomePage;
