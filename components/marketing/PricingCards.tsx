"use client";

import { useState } from "react";
import Link from "next/link";
import { useConvexAuth, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 3,
    interval: "month",
    productId: process.env.NEXT_PUBLIC_DODO_MONTHLY_PRODUCT_ID ?? "",
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 30,
    interval: "year",
    productId: process.env.NEXT_PUBLIC_DODO_YEARLY_PRODUCT_ID ?? "",
    badge: "Save $6",
  },
];

export function PricingCards() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const createCheckout = useAction(api.payments.createCheckout);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (productId: string, planId: string) => {
    setLoadingPlan(planId);
    try {
      const result = await createCheckout({ productId });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="relative rounded-lg border bg-card p-6 shadow-sm"
        >
          {plan.badge && (
            <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              {plan.badge}
            </span>
          )}
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="ml-1 text-muted-foreground">/{plan.interval}</span>
          </div>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              All features included
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Cancel anytime
            </li>
          </ul>
          <div className="mt-6">
            {isLoading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : isAuthenticated ? (
              <Button
                className="w-full"
                onClick={() => handleCheckout(plan.productId, plan.id)}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            ) : (
              <Link
                href="/sign-up?returnTo=/choose-plan"
                className={cn(buttonVariants(), "w-full")}
              >
                Get started
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
