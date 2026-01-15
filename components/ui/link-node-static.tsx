import * as React from 'react';

import type { TLinkElement } from 'platejs';
import type { SlateElementProps } from 'platejs/static';

import { getLinkAttributes } from '@platejs/link';
import { SlateElement } from 'platejs/static';

export function LinkElementStatic(props: SlateElementProps<TLinkElement>) {
  const linkAttributes = getLinkAttributes(props.editor, props.element);

  return (
    <SlateElement
      {...props}
      as="a"
      className="font-medium text-primary underline decoration-primary underline-offset-4"
      attributes={{
        ...props.attributes,
        ...linkAttributes,
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
        },
      }}
    >
      {props.children}
    </SlateElement>
  );
}
