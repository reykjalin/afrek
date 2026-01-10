import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const recordTrialEmail = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await ctx.db
      .query("trialEmails")
      .withIndex("byEmail", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("trialEmails", {
      email: normalizedEmail,
      createdAt: Date.now(),
    });
  },
});

export const hasUsedTrial = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await ctx.db
      .query("trialEmails")
      .withIndex("byEmail", (q) => q.eq("email", normalizedEmail))
      .first();

    return existing !== null;
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .first();

    if (!user || user.role !== "admin") return [];

    const emails = await ctx.db.query("trialEmails").order("desc").collect();
    return emails.map((e) => ({
      id: e._id,
      email: e.email,
      createdAt: e.createdAt,
    }));
  },
});

export const deleteTrialEmail = mutation({
  args: {
    id: v.id("trialEmails"),
  },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(id);
  },
});
