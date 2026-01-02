import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    notesMarkdown: v.string(),
    tags: v.array(v.string()),
    status: v.union(
      v.literal("backlog"),
      v.literal("scheduled"),
      v.literal("done")
    ),
    priority: v.union(
      v.literal("Lowest"),
      v.literal("Low"),
      v.literal("Normal"),
      v.literal("Medium"),
      v.literal("High"),
      v.literal("Highest")
    ),
    scheduledDate: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_scheduled", ["userId", "scheduledDate"])
    .index("by_user_status", ["userId", "status"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userId"],
    })
    .searchIndex("search_notes", {
      searchField: "notesMarkdown",
      filterFields: ["userId"],
    }),
});
