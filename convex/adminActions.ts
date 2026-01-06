"use node";

import { action, ActionCtx } from "./_generated/server";
import { v } from "convex/values";
import { clerkClient } from "@clerk/nextjs/server";
import { internal } from "./_generated/api";

async function assertAdminAction(ctx: ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const role = (identity as { metadata?: { role?: string } }).metadata?.role;
  if (role !== "admin") {
    throw new Error("Admin access required");
  }

  return identity;
}

export const searchUsers = action({
  args: { searchQuery: v.string() },
  handler: async (ctx, args) => {
    await assertAdminAction(ctx);

    const clerk = await clerkClient();
    const clerkUsers = await clerk.users.getUserList({
      query: args.searchQuery,
      limit: 20,
    });

    const userList = clerkUsers.data.map((u) => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress ?? "",
      firstName: u.firstName,
      lastName: u.lastName,
      createdAt: u.createdAt,
      role: (u.publicMetadata as { role?: string })?.role ?? "user",
    }));

    return userList;
  },
});

export const setUserRole = action({
  args: {
    targetUserId: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, { targetUserId, role }) => {
    await assertAdminAction(ctx);

    const clerk = await clerkClient();
    await clerk.users.updateUser(targetUserId, {
      publicMetadata: { role },
    });
  },
});

export const deleteUserAndData = action({
  args: { targetUserId: v.string() },
  handler: async (ctx, { targetUserId }) => {
    await assertAdminAction(ctx);

    await ctx.runMutation(internal.admin.deleteUserData, {
      externalId: targetUserId,
    });

    const clerk = await clerkClient();
    await clerk.users.deleteUser(targetUserId);
  },
});
