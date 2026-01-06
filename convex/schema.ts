import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(), // Clerk user ID
    // Subscription fields
    plan: v.optional(
      v.object({
        id: v.optional(v.string()), // Clerk plan ID.
        key: v.optional(v.string()),
        status: v.union(v.literal("active"), v.literal("none")),
        subscription: v.optional(
          v.object({
            id: v.string(), // Clerk subscription ID.
            itemId: v.string(), // Clerk subscription item ID
          }),
        ),
        trial: v.optional(
          v.object({
            status: v.union(
              v.literal("active"),
              v.literal("ending_soon"),
              v.literal("none"),
            ),
          }),
        ),
      }),
    ),
    // Encryption settings (passkey-based)
    encryption: v.optional(
      v.object({
        credentialId: v.string(), // base64url passkey credential ID
        keyCheck: v.string(), // encrypted blob to verify key is correct
        createdAt: v.number(),
      }),
    ),
  }).index("byExternalId", ["externalId"]),

  tasks: defineTable({
    title: v.string(),
    notesJson: v.string(),
    tags: v.array(v.string()),
    // Encrypted payload containing title, notesJson, tags when encryption is enabled
    // When set, title/notesJson/tags contain placeholders
    encryptedPayload: v.optional(v.string()),
    status: v.union(
      v.literal("backlog"),
      v.literal("scheduled"),
      v.literal("done"),
    ),
    priority: v.union(
      v.literal("Lowest"),
      v.literal("Low"),
      v.literal("Normal"),
      v.literal("Medium"),
      v.literal("High"),
      v.literal("Highest"),
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
      searchField: "notesJson",
      filterFields: ["userId"],
    }),
});
