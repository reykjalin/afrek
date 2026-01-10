'use client';

import type { AutoformatRule } from '@platejs/autoformat';

import { AutoformatPlugin } from '@platejs/autoformat';
import { KEYS } from 'platejs';

// Only mark-based autoformat rules for titles (no blocks)
const autoformatMarks: AutoformatRule[] = [
  {
    match: '**',
    mode: 'mark',
    type: KEYS.bold,
  },
  {
    match: '*',
    mode: 'mark',
    type: KEYS.italic,
  },
  {
    match: '_',
    mode: 'mark',
    type: KEYS.italic,
  },
  {
    match: '__',
    mode: 'mark',
    type: KEYS.underline,
  },
  {
    match: '`',
    mode: 'mark',
    type: KEYS.code,
  },
];

export const TitleAutoformatKit = [
  AutoformatPlugin.configure({
    options: {
      enableUndoOnDelete: true,
      rules: autoformatMarks,
    },
  }),
];
