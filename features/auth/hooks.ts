import { useUser } from "@clerk/nextjs";

export function useCurrentUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  return {
    userId: user?.id,
    isLoaded,
    isSignedIn: isSignedIn ?? false,
  };
}

export function useIsAdmin(): boolean {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return false;
  return user.publicMetadata?.role === "admin";
}
