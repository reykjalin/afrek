import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Subscription } from "./types";

export function useSubscription(): Subscription | null | undefined {
  const data = useQuery(api.subscriptions.getForCurrentUser);

  if (data === undefined) return undefined; // Loading
  if (data === null) return null; // Not authenticated

  return {
    userId: "",
    stripeCustomerId: "",
    status: data.hasActiveSubscription ? "active" : "none",
    priceId: data.planKey ?? "",
    currentPeriodEnd: 0,
  };
}

export function useIsSubscribed(): boolean | undefined {
  const subscription = useSubscription();
  if (subscription === undefined) return undefined; // Loading
  return subscription?.status === "active";
}
