import { internalAction, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Activate subscription by user ID (called from webhook)
export const activateByUserId = internalMutation({
  args: {
    userId: v.string(),
    subscriptionId: v.string(),
    dodoCustomerId: v.string(),
  },
  handler: async (ctx, { userId, subscriptionId, dodoCustomerId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", userId))
      .first();

    if (!user) {
      console.warn(
        `Cannot activate subscription: no user found for externalId ${userId}`,
      );
      return;
    }

    await ctx.db.patch(user._id, {
      dodoCustomerId,
      plan: {
        key: "premium",
        status: "active",
        subscription: {
          id: subscriptionId,
          itemId: "",
        },
        trial: { status: "none" },
      },
    });
  },
});

// Cancel subscription by user ID (called from webhook)
export const cancelByUserId = internalMutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", userId))
      .first();

    if (!user) {
      console.warn(
        `Cannot cancel subscription: no user found for externalId ${userId}`,
      );
      return;
    }

    await ctx.db.patch(user._id, {
      plan: {
        status: "none",
        trial: { status: "none" },
      },
    });
  },
});

// Cancel subscription by subscription ID (called from webhook)
export const cancelBySubscriptionId = internalMutation({
  args: {
    subscriptionId: v.string(),
  },
  handler: async (ctx, { subscriptionId }) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(
      (u) => u.plan?.subscription?.id === subscriptionId,
    );

    if (!user) {
      console.warn(
        `Cannot cancel subscription: no user found for subscriptionId ${subscriptionId}`,
      );
      return;
    }

    await ctx.db.patch(user._id, {
      plan: {
        status: "none",
        trial: { status: "none" },
      },
    });
  },
});

// Cancel subscription in Dodo Payments (called when user is deleted)
export const cancelInDodoPayments = internalAction({
  args: {
    subscriptionId: v.string(),
  },
  handler: async (ctx, { subscriptionId }) => {
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode";

    if (!apiKey) {
      console.error("DODO_PAYMENTS_API_KEY not configured");
      return;
    }

    const baseUrl =
      environment === "live_mode"
        ? "https://live.dodopayments.com"
        : "https://test.dodopayments.com";

    try {
      const response = await fetch(
        `${baseUrl}/subscriptions/${subscriptionId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("Failed to cancel subscription in Dodo Payments:", error);
      } else {
        console.log("✅ Subscription cancelled in Dodo Payments:", subscriptionId);
      }
    } catch (error) {
      console.error("Error cancelling subscription in Dodo Payments:", error);
    }

    await ctx.runMutation(internal.subscriptions.cancelBySubscriptionId, {
      subscriptionId,
    });
  },
});

// Get current user's subscription status
export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return null;

    return {
      status: user.plan?.status ?? "none",
      planKey: user.plan?.key,
      subscriptionId: user.plan?.subscription?.id,
      hasActiveSubscription:
        user.plan?.key === "premium" && user.plan?.status === "active",
    };
  },
});
