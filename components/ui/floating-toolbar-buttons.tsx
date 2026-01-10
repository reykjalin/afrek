'use client';

import * as React from 'react';

import {
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { InlineEquationToolbarButton } from './equation-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { ToolbarGroup } from './toolbar';

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  if (readOnly) return null;

  return (
    <ToolbarGroup>
      <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
        <BoldIcon />
      </MarkToolbarButton>

      <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
        <ItalicIcon />
      </MarkToolbarButton>

      <MarkToolbarButton nodeType={KEYS.underline} tooltip="Underline (⌘+U)">
        <UnderlineIcon />
      </MarkToolbarButton>

      <MarkToolbarButton
        nodeType={KEYS.strikethrough}
        tooltip="Strikethrough (⌘+⇧+X)"
      >
        <StrikethroughIcon />
      </MarkToolbarButton>

      <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
        <Code2Icon />
      </MarkToolbarButton>

      <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight (⌘+⇧+H)">
        <HighlighterIcon />
      </MarkToolbarButton>

      <InlineEquationToolbarButton />

      <LinkToolbarButton />
    </ToolbarGroup>
  );
}
