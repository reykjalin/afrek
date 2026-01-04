/**
 * Check if the keyboard event target is an editable element.
 * Returns true if focus is on an input, textarea, contenteditable element,
 * or the Plate editor.
 */
export function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }

  // Check for form inputs
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  ) {
    return true;
  }

  // Check for contenteditable (used by Plate/Slate editors)
  if (target.isContentEditable) {
    return true;
  }

  // Check for Slate editor attribute
  if (target.hasAttribute("data-slate-editor")) {
    return true;
  }

  return false;
}
