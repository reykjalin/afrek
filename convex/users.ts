import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
  MutationCtx,
} from "./_generated/server";
import type { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

// Query to get current user
export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// Upsert user from Clerk webhook (user.created, user.updated)
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const userAttributes = {
      externalId: data.id,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", {
        ...userAttributes,
      });
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

// Delete user from Clerk webhook (user.deleted)
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

// Update subscription from Clerk billing webhook (subscriptionItem.active)
export const activateSubscription = internalMutation({
  args: {
    clerkUserId: v.string(),
    planId: v.string(),
    planSlug: v.string(),
    subscriptionId: v.string(),
    subscriptionItemId: v.string(),
    isTrial: v.boolean(),
    trialEndsAt: v.optional(v.number()),
  },
  async handler(
    ctx,
    {
      clerkUserId,
      planId,
      planSlug,
      subscriptionId,
      subscriptionItemId,
      isTrial,
    },
  ) {
    const user = await userByExternalId(ctx, clerkUserId);

    const plan = {
      id: planId,
      key: planSlug,
      subscription: {
        id: subscriptionId,
        itemId: subscriptionItemId,
      },
      status: "active" as const,
      trial: { status: isTrial ? ("active" as const) : ("none" as const) },
    };

    if (user === null) {
      await ctx.db.insert("users", {
        externalId: clerkUserId,
        plan,
      });
    } else {
      await ctx.db.patch(user._id, {
        plan,
      });
    }
  },
});

// End subscription from Clerk billing webhook (subscriptionItem.ended)
export const endSubscription = internalMutation({
  args: { clerkUserId: v.string(), planSlug: v.string() },
  async handler(ctx, { clerkUserId, planSlug }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user === null) {
      console.warn(
        `Can't end subscription, no user for Clerk ID: ${clerkUserId}`,
      );
      return;
    }

    if (user.plan === undefined) {
      console.warn(
        `Can't end subscription, no plan active for Clerk ID: ${clerkUserId}`,
      );
      return;
    }

    if (user.plan.key !== planSlug) {
      console.warn(
        `Can't end subscription, plan ${planSlug} does not match currently active plan ${user.plan.key}`,
      );
      return;
    }

    await ctx.db.patch(user._id, {
      plan: { status: "none", trial: { status: "none" } },
    });
  },
});

// Update trial ending notification from Clerk billing webhook (subscriptionItem.freeTrialEnding)
export const updateTrialEnding = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user === null) {
      console.warn(
        `Can't update trial ending, no user for Clerk ID: ${clerkUserId}`,
      );
      return;
    }

    await ctx.db.patch(user._id, {
      plan: { status: "active", trial: { status: "ending_soon" } },
    });
  },
});

// Helper: Get current user or throw
export async function getCurrentUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

// Helper: Get current user (may return null)
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

// Helper: Check if user can modify tasks
export async function requireActiveSubscription(ctx: MutationCtx) {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const canModify =
    user.plan?.key === "premium" && user.plan?.status === "active";

  if (!canModify) {
    throw new Error("Subscription required to modify tasks");
  }

  return user;
}

// Helper: Look up user by Clerk external ID
async function userByExternalId(
  ctx: QueryCtx | MutationCtx,
  externalId: string,
) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

// Set encryption settings for the current user
export const setEncryption = mutation({
  args: {
    credentialId: v.string(),
    keyCheck: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    await ctx.db.patch(user._id, {
      encryption: {
        credentialId: args.credentialId,
        keyCheck: args.keyCheck,
        createdAt: Date.now(),
      },
    });
  },
});

// Clear encryption settings for the current user
export const clearEncryption = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    await ctx.db.patch(user._id, {
      encryption: undefined,
    });
  },
});
