'use client';

import { SingleLinePlugin } from '@platejs/utils';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import { DatePlugin } from '@platejs/date/react';
import { LinkPlugin } from '@platejs/link/react';
import { ParagraphPlugin, createPlatePlugin } from 'platejs/react';

import { CodeLeaf } from '@/components/ui/code-node';
import { DateElement } from '@/components/ui/date-node';
import { LinkElement } from '@/components/ui/link-node';
import { LinkFloatingToolbar } from '@/components/ui/link-toolbar';
import { TitleFloatingToolbar } from '@/components/ui/title-floating-toolbar';
import { TitleFloatingToolbarButtons } from '@/components/ui/title-floating-toolbar-buttons';
import { TitleAutoformatKit } from '@/components/editor/plugins/title-autoformat-kit';

export const TitleEditorKit = [
  // Base paragraph plugin
  ParagraphPlugin,
  
  // Single line plugin to restrict to one line
  SingleLinePlugin,
  
  // Basic marks (limited set for titles)
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  CodePlugin.configure({
    node: { component: CodeLeaf },
    shortcuts: { toggle: { keys: 'mod+e' } },
  }),
  
  // Autoformat for marks (backticks -> code, etc.)
  ...TitleAutoformatKit,
  
  // Date element
  DatePlugin.withComponent(DateElement),
  
  // Link element with floating toolbar
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
  
  // Floating toolbar for marks
  createPlatePlugin({
    key: 'title-floating-toolbar',
    render: {
      afterEditable: () => (
        <TitleFloatingToolbar>
          <TitleFloatingToolbarButtons />
        </TitleFloatingToolbar>
      ),
    },
  }),
];
