"use node";

import { action, ActionCtx } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

type UserSearchResult = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: number;
  role: string;
};

async function assertAdminAction(ctx: ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const user = await ctx.runQuery(internal.users.getByExternalId, {
    externalId: identity.subject,
  });

  if (!user || user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return identity;
}

export const searchUsers = action({
  args: { searchQuery: v.string() },
  handler: async (ctx, args): Promise<UserSearchResult[]> => {
    await assertAdminAction(ctx);

    const q = args.searchQuery.toLowerCase();

    const users = await ctx.runQuery(internal.users.listAll, {});

    const filtered = users
      .filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          `${u.firstName ?? ""} ${u.lastName ?? ""}`
            .toLowerCase()
            .includes(q) ||
          u.externalId.toLowerCase().includes(q)
      )
      .slice(0, 20);

    return filtered.map((u) => ({
      id: u.externalId,
      email: u.email ?? "",
      firstName: u.firstName ?? null,
      lastName: u.lastName ?? null,
      createdAt: u._creationTime,
      role: u.role ?? "user",
    }));
  },
});

export const setUserRole = action({
  args: {
    targetUserId: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, { targetUserId, role }) => {
    await assertAdminAction(ctx);

    const user = await ctx.runQuery(internal.users.getByExternalId, {
      externalId: targetUserId,
    });

    if (!user) throw new Error("User not found");

    await ctx.runMutation(internal.users.setRole, {
      userId: user._id,
      role,
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

    const user = await ctx.runQuery(internal.users.getByExternalId, {
      externalId: targetUserId,
    });

    if (user) {
      await ctx.runMutation(internal.users.deleteUser, { userId: user._id });
    }
  },
});
