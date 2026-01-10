'use client';

import { TrailingBlockPlugin } from '@platejs/utils';

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit';
import { AutoformatKit } from '@/components/editor/plugins/autoformat-kit';
import { BlockSelectionKit } from '@/components/editor/plugins/block-selection-kit';
import { CalloutKit } from '@/components/editor/plugins/callout-kit';
import { CodeBlockKit } from '@/components/editor/plugins/code-block-kit';
import { ColumnKit } from '@/components/editor/plugins/column-kit';
import { DateKit } from '@/components/editor/plugins/date-kit';
import { DndKit } from '@/components/editor/plugins/dnd-kit';
import { EmojiKit } from '@/components/editor/plugins/emoji-kit';

import { LinkKit } from '@/components/editor/plugins/link-kit';
import { ListKit } from '@/components/editor/plugins/list-kit';
import { MathKit } from '@/components/editor/plugins/math-kit';
import { SlashKit } from '@/components/editor/plugins/slash-kit';
import { TocKit } from '@/components/editor/plugins/toc-kit';
import { ToggleKit } from '@/components/editor/plugins/toggle-kit';

export const NotesEditorKit = [
  // Elements & marks first
  ...BasicNodesKit,
  ...CalloutKit,
  ...CodeBlockKit,
  ...ColumnKit,
  ...DateKit,
  ...LinkKit,
  ...ListKit,
  ...MathKit,
  ...TocKit,
  ...ToggleKit,

  // Editing behaviors
  ...AutoformatKit,
  ...BlockSelectionKit,
  ...DndKit,
  ...EmojiKit,
  ...SlashKit,
  TrailingBlockPlugin,
];
