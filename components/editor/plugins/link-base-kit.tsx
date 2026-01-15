import { BaseLinkPlugin } from '@platejs/link';

import { LinkElementStatic } from '@/components/ui/link-node-static';

export const BaseLinkKit = [
  BaseLinkPlugin.configure({
    options: {
      defaultLinkAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    },
  }).withComponent(LinkElementStatic),
];
