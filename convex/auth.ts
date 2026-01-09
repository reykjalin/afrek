import { AuthKit, type AuthFunctions } from "@convex-dev/workos-authkit";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

const authFunctions: AuthFunctions = internal.auth;

export const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {
  authFunctions,
});

export const { authKitEvent } = authKit.events({
  "user.created": async (ctx, event) => {
    const data = event.data;
    const existingUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", data.id))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: data.email,
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
      });
    } else {
      await ctx.db.insert("users", {
        externalId: data.id,
        email: data.email,
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
        role: "user",
      });
    }
  },

  "user.updated": async (ctx, event) => {
    const data = event.data;
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", data.id))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        email: data.email,
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
      });
    } else {
      await ctx.db.insert("users", {
        externalId: data.id,
        email: data.email,
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
        role: "user",
      });
    }
  },

  "user.deleted": async (ctx, event) => {
    const data = event.data;
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", data.id))
      .first();

    if (user) {
      if (user.plan?.subscription?.id) {
        await ctx.scheduler.runAfter(
          0,
          internal.subscriptions.cancelInDodoPayments,
          { subscriptionId: user.plan.subscription.id }
        );
      }

      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_user", (q) => q.eq("userId", user.externalId))
        .collect();

      for (const task of tasks) {
        await ctx.db.delete(task._id);
      }

      await ctx.db.delete(user._id);
    }
  },
});
