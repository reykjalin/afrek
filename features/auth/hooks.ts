// Auth hooks - will wrap Clerk hooks once integrated (Phase 3)

export function useCurrentUser() {
  // Will use: useUser() from @clerk/nextjs
  return {
    userId: undefined as string | undefined,
    isLoaded: true,
    isSignedIn: false,
  };
}
