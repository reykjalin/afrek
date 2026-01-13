/**
 * Starts a view transition if the browser supports it.
 * Falls back to immediate callback execution if not supported.
 */
export function startViewTransition(callback: () => void | Promise<void>): void {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // Skip animation
    callback();
    return;
  }

  // Check if View Transitions API is supported
  if (document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    // Fallback: just run the callback
    callback();
  }
}
