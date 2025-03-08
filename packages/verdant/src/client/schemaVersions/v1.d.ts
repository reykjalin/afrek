import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type NoteSnapshot = {
  id: string;
  content: NoteContentSnapshot;
  isTask: boolean;
  done: boolean;
  createdAt: number;
  completedAt: number;
};

export type NoteContentAttrsSnapshot = {
  [key: string]: NoteContentAttrsValueSnapshot;
};
export type NoteContentContentItemAttrsSnapshot = {
  [key: string]: NoteContentContentItemAttrsValueSnapshot;
};
export type NoteContentContentItemContentSnapshot =
  NoteContentContentSnapshot[];
export type NoteContentContentItemMarksSnapshot = NoteContentContentSnapshot[];
export type NoteContentContentItemSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: NoteContentContentItemAttrsSnapshot;
  content: NoteContentContentItemContentSnapshot;
  text: string | null;
  marks: NoteContentContentItemMarksSnapshot;
};
export type NoteContentContentSnapshot = NoteContentContentItemSnapshot[];
export type NoteContentMarksSnapshot = NoteContentContentSnapshot[];
export type NoteContentSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: NoteContentAttrsSnapshot;
  content: NoteContentContentSnapshot;
  text: string | null;
  marks: NoteContentMarksSnapshot;
};
export type NoteInit = {
  id?: string;
  content?: NoteContentInit;
  isTask?: boolean;
  done?: boolean;
  createdAt?: number;
  completedAt?: number;
};

export type NoteContentAttrsInit = { [key: string]: NoteContentAttrsValueInit };
export type NoteContentContentItemAttrsInit = {
  [key: string]: NoteContentContentItemAttrsValueInit;
};
export type NoteContentContentItemContentInit = NoteContentContentInit[];
export type NoteContentContentItemMarksInit = NoteContentContentInit[];
export type NoteContentContentItemInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: NoteContentContentItemAttrsInit;
  content?: NoteContentContentItemContentInit;
  text?: string | null;
  marks?: NoteContentContentItemMarksInit;
};
export type NoteContentContentInit = NoteContentContentItemInit[];
export type NoteContentMarksInit = NoteContentContentInit[];
export type NoteContentInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: NoteContentAttrsInit;
  content?: NoteContentContentInit;
  text?: string | null;
  marks?: NoteContentMarksInit;
};

export type MigrationTypes = {
  notes: { init: NoteInit; snapshot: NoteSnapshot };
};
