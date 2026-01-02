import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listTasks = query({
  args: {
    userId: v.string(),
    search: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(v.literal("backlog"), v.literal("scheduled"), v.literal("done"))
    ),
  },
  handler: async (ctx, args) => {
    let tasks;

    if (args.search && args.search.trim()) {
      tasks = await ctx.db
        .query("tasks")
        .withSearchIndex("search_title", (q) =>
          q.search("title", args.search!).eq("userId", args.userId)
        )
        .collect();
    } else {
      tasks = await ctx.db
        .query("tasks")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
    }

    if (args.status) {
      tasks = tasks.filter((t) => t.status === args.status);
    }

    if (args.tags && args.tags.length > 0) {
      tasks = tasks.filter((t) =>
        args.tags!.some((tag) => t.tags.includes(tag))
      );
    }

    return tasks;
  },
});

export const getTask = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createTask = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    tags: v.optional(v.array(v.string())),
    scheduledDate: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal("Lowest"),
        v.literal("Low"),
        v.literal("Normal"),
        v.literal("Medium"),
        v.literal("High"),
        v.literal("Highest")
      )
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("tasks", {
      userId: args.userId,
      title: args.title,
      tags: args.tags ?? [],
      scheduledDate: args.scheduledDate,
      priority: args.priority ?? "Normal",
      status: args.scheduledDate ? "scheduled" : "backlog",
      notesMarkdown: "",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    notesMarkdown: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(v.literal("backlog"), v.literal("scheduled"), v.literal("done"))
    ),
    priority: v.optional(
      v.union(
        v.literal("Lowest"),
        v.literal("Low"),
        v.literal("Normal"),
        v.literal("Medium"),
        v.literal("High"),
        v.literal("Highest")
      )
    ),
    scheduledDate: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Task not found");

    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    if (args.title !== undefined) updates.title = args.title;
    if (args.notesMarkdown !== undefined)
      updates.notesMarkdown = args.notesMarkdown;
    if (args.tags !== undefined) updates.tags = args.tags;
    if (args.priority !== undefined) updates.priority = args.priority;

    if (args.scheduledDate !== undefined) {
      updates.scheduledDate =
        args.scheduledDate === null ? undefined : args.scheduledDate;
    }

    if (args.status !== undefined) {
      updates.status = args.status;
      if (args.status === "done" && existing.status !== "done") {
        updates.completedAt = Date.now();
      } else if (args.status !== "done" && existing.status === "done") {
        updates.completedAt = undefined;
      }
    }

    await ctx.db.patch(args.id, updates);
  },
});

export const toggleDone = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    if (task.status === "done") {
      await ctx.db.patch(args.id, {
        status: task.scheduledDate ? "scheduled" : "backlog",
        completedAt: undefined,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(args.id, {
        status: "done",
        completedAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
