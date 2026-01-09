import {
  mutation,
  query,
  QueryCtx,
  MutationCtx,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { v } from "convex/values";

// Query to get current user
export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
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

// Helper: Look up user by external ID
export async function userByExternalId(
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

// Get user by external ID (for admin functions)
export const getByExternalId = internalQuery({
  args: { externalId: v.string() },
  handler: async (ctx, { externalId }) => {
    return await userByExternalId(ctx, externalId);
  },
});

// List all users (for admin)
export const listAll = internalQuery({
  args: {},
  handler: async (ctx): Promise<Doc<"users">[]> => {
    return await ctx.db.query("users").collect();
  },
});

// Set user role (admin only, called from adminActions)
export const setRole = internalMutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, { userId, role }) => {
    await ctx.db.patch(userId, { role });
  },
});

// Delete user by ID (for admin)
export const deleteUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.delete(userId);
  },
});

// Delete user and all their data by external ID
export const deleteUserData = internalMutation({
  args: {
    externalId: v.string(),
  },
  handler: async (ctx, { externalId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
      .first();

    if (!user) return;

    // Delete all tasks
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Delete user record
    await ctx.db.delete(user._id);
  },
});
