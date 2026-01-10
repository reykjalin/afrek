'use client';

import * as React from 'react';

import {
  type FloatingToolbarState,
  flip,
  offset,
  getSelectionBoundingClientRect,
  useVirtualFloating,
} from '@platejs/floating';
import { useComposedRef, useOnClickOutside } from '@udecode/cn';
import { KEYS } from 'platejs';
import {
  useEditorRef,
  useEditorSelector,
  usePluginOption,
  useFocused,
} from 'platejs/react';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';

export function TitleFloatingToolbar({
  children,
  className,
  state,
  ...props
}: React.ComponentProps<typeof Toolbar> & {
  state?: FloatingToolbarState;
}) {
  const editor = useEditorRef();
  const focused = useFocused();
  const isFloatingLinkOpen = !!usePluginOption({ key: KEYS.link }, 'mode');
  
  // Check if selection is expanded (text is selected)
  const selectionExpanded = useEditorSelector(
    () => editor.api.isExpanded(),
    []
  );
  
  // Get the selected text
  const selectionText = useEditorSelector(
    () => editor.api.string(),
    []
  );

  const [open, setOpen] = React.useState(false);
  const [mousedown, setMousedown] = React.useState(false);

  // Track mouse state
  React.useEffect(() => {
    const handleMouseUp = () => setMousedown(false);
    const handleMouseDown = () => setMousedown(true);
    
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Determine if toolbar should be open
  React.useEffect(() => {
    if (!selectionExpanded || !selectionText || isFloatingLinkOpen) {
      setOpen(false);
      return;
    }
    
    // Don't open while mouse is down (user is still selecting)
    if (mousedown) {
      return;
    }
    
    // Only show when focused and has selection
    if (focused && selectionExpanded && selectionText) {
      setOpen(true);
    }
  }, [selectionExpanded, selectionText, mousedown, focused, isFloatingLinkOpen]);

  const floating = useVirtualFloating({
    open,
    getBoundingClientRect: () => getSelectionBoundingClientRect(editor),
    onOpenChange: setOpen,
    ...state?.floatingOptions,
    middleware: [
      offset(8),
      flip({
        fallbackPlacements: [
          'top-start',
          'top-end',
          'bottom-start',
          'bottom-end',
        ],
        padding: 12,
      }),
    ],
    placement: 'top',
  });

  const clickOutsideRef = useOnClickOutside(() => {
    setOpen(false);
  }, { ignoreClass: 'ignore-click-outside/toolbar' });

  const ref = useComposedRef<HTMLDivElement>(props.ref, floating.refs.setFloating);

  if (!open) return null;

  return (
    <div ref={clickOutsideRef}>
      <Toolbar
        {...props}
        ref={ref}
        style={floating.style}
        className={cn(
          'scrollbar-hide absolute z-50 overflow-x-auto whitespace-nowrap rounded-md border bg-popover p-1 opacity-100 shadow-md print:hidden',
          className
        )}
      >
        {children}
      </Toolbar>
    </div>
  );
}
