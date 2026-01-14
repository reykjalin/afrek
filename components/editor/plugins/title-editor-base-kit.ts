import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseUnderlinePlugin,
} from '@platejs/basic-nodes';
import { BaseDatePlugin } from '@platejs/date';
import { BaseLinkPlugin } from '@platejs/link';
import { MarkdownPlugin } from '@platejs/markdown';
import { BaseParagraphPlugin } from 'platejs';

import { CodeLeafStatic } from '@/components/ui/code-node-static';
import { DateElementStatic } from '@/components/ui/date-node-static';
import { LinkElementStatic } from '@/components/ui/link-node-static';
import { ParagraphElementStatic } from '@/components/ui/paragraph-node-static';

export const TitleEditorBaseKit = [
  BaseParagraphPlugin.withComponent(ParagraphElementStatic),

  BaseBoldPlugin,
  BaseItalicPlugin,
  BaseUnderlinePlugin,
  BaseCodePlugin.withComponent(CodeLeafStatic),

  BaseDatePlugin.withComponent(DateElementStatic),

  BaseLinkPlugin.withComponent(LinkElementStatic),

  MarkdownPlugin,
];
