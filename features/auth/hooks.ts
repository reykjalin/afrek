import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useCurrentUser() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(
    api.users.current,
    isAuthenticated ? {} : "skip"
  );

  return {
    userId: user?.externalId,
    isLoaded: !isLoading && (isAuthenticated ? user !== undefined : true),
    isSignedIn: isAuthenticated,
    user,
  };
}

export function useIsAdmin(): boolean {
  const { user, isLoaded } = useCurrentUser();
  if (!isLoaded || !user) return false;
  return user.role === "admin";
}
