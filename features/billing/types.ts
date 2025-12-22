export type SubscriptionStatus = "active" | "past_due" | "canceled" | "none";

export interface Subscription {
  userId: string;
  stripeCustomerId: string;
  status: SubscriptionStatus;
  priceId: string;
  currentPeriodEnd: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  priceId: string;
}

export const PLANS: PricingPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: 3,
    interval: "month",
    priceId: "", // Will be set from env
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 30,
    interval: "year",
    priceId: "", // Will be set from env
  },
];

export const FREE_TASK_LIMIT = 50;
