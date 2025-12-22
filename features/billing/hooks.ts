// Billing hooks - will wrap Convex subscription queries (Phase 7)

import type { Subscription } from "./types";

export function useSubscription(): Subscription | null | undefined {
  // Will use: useQuery(api.subscriptions.getSubscription, { userId })
  return null;
}

export function useIsSubscribed(): boolean {
  const subscription = useSubscription();
  return subscription?.status === "active";
}
