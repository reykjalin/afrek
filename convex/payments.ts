import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { checkout, customerPortal } from "./dodo";

const TRIAL_PERIOD_DAYS = 30;

export const createCheckout = action({
  args: {
    productId: v.string(),
  },
  handler: async (ctx, { productId }): Promise<{ checkoutUrl: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.runQuery(internal.users.getByExternalId, {
      externalId: identity.subject,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    let trialPeriodDays: number | undefined;
    if (user?.email) {
      const hasUsedTrial = await ctx.runQuery(internal.trialEmails.hasUsedTrial, {
        email: user.email,
      });
      if (!hasUsedTrial) {
        trialPeriodDays = TRIAL_PERIOD_DAYS;
      }
    }

    const result = await checkout(ctx, {
      payload: {
        product_cart: [{ product_id: productId, quantity: 1 }],
        return_url: `${appUrl}/checkout/success`,
        customer: user?.email
          ? {
              email: user.email,
              name: [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined,
            }
          : undefined,
        metadata: {
          userId: identity.subject,
        },
        subscription_data: trialPeriodDays
          ? { trial_period_days: trialPeriodDays }
          : undefined,
      },
    });

    return { checkoutUrl: result.checkout_url };
  },
});

export const getCustomerPortal = action({
  args: {
    send_email: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<{ portalUrl: string } | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    try {
      const result = await customerPortal(ctx, {
        send_email: args.send_email,
      });
      return { portalUrl: result.portal_url };
    } catch (error) {
      console.error("Failed to create customer portal session:", error);
      return null;
    }
  },
});
