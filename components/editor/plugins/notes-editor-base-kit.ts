import { MarkdownPlugin } from '@platejs/markdown';

import { BaseBasicBlocksKit } from '@/components/editor/plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from '@/components/editor/plugins/basic-marks-base-kit';
import { BaseCalloutKit } from '@/components/editor/plugins/callout-base-kit';
import { BaseCodeBlockKit } from '@/components/editor/plugins/code-block-base-kit';
import { BaseColumnKit } from '@/components/editor/plugins/column-base-kit';
import { BaseDateKit } from '@/components/editor/plugins/date-base-kit';
import { BaseLinkKit } from '@/components/editor/plugins/link-base-kit';
import { BaseListKit } from '@/components/editor/plugins/list-base-kit';
import { BaseMathKit } from '@/components/editor/plugins/math-base-kit';
import { BaseTocKit } from '@/components/editor/plugins/toc-base-kit';
import { BaseToggleKit } from '@/components/editor/plugins/toggle-base-kit';

export const NotesEditorBaseKit = [
  ...BaseBasicBlocksKit,
  ...BaseBasicMarksKit,
  ...BaseCalloutKit,
  ...BaseCodeBlockKit,
  ...BaseColumnKit,
  ...BaseDateKit,
  ...BaseLinkKit,
  ...BaseListKit,
  ...BaseMathKit,
  ...BaseTocKit,
  ...BaseToggleKit,

  MarkdownPlugin,
];
