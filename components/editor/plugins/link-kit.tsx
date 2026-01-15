'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '@/components/ui/link-node';
import { LinkFloatingToolbar } from '@/components/ui/link-toolbar';

export const LinkKit = [
  LinkPlugin.configure({
    options: {
      defaultLinkAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    },
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
];
