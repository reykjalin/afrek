import { query, internalMutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

async function assertAdminQuery(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const role = (identity as { metadata?: { role?: string } }).metadata?.role;
  if (role !== "admin") throw new Error("Admin access required");

  return identity;
}

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await assertAdminQuery(ctx);

    const users = await ctx.db.query("users").collect();
    const tasks = await ctx.db.query("tasks").collect();

    const activeSubscriptions = users.filter(
      (u) => u.plan?.status === "active"
    ).length;

    const completedTasks = tasks.filter((t) => t.status === "done").length;

    return {
      totalUsers: users.length,
      activeSubscriptions,
      totalTasks: tasks.length,
      completedTasks,
    };
  },
});

export const deleteUserData = internalMutation({
  args: { externalId: v.string() },
  handler: async (ctx, { externalId }) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});
