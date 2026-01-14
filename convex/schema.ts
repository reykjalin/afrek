import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(), // Auth provider user ID (e.g., WorkOS)
    // User profile fields (synced from auth provider)
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    // Role for admin access
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
    // Dodo Payments customer ID
    dodoCustomerId: v.optional(v.string()),
    // Subscription fields
    plan: v.optional(
      v.object({
        id: v.optional(v.string()), // Billing plan ID
        key: v.optional(v.string()),
        status: v.union(v.literal("active"), v.literal("none")),
        subscription: v.optional(
          v.object({
            id: v.string(), // Subscription ID
            itemId: v.string(), // Subscription item ID
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
  })
    .index("byExternalId", ["externalId"])
    .index("byEmail", ["email"]),

  tasks: defineTable({
    titleJson: v.string(), // Rich text Plate.js JSON value
    notesJson: v.string(),
    // Plain text versions for search indexing (extracted from JSON)
    titleText: v.optional(v.string()),
    notesText: v.optional(v.string()),
    tags: v.array(v.string()),
    // Encrypted payload containing titleJson, notesJson, titleText, notesText, tags when encryption is enabled
    // When set, all content fields contain empty placeholders
    encryptedPayload: v.optional(v.string()),
    status: v.union(
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
      searchField: "titleText",
      filterFields: ["userId"],
    })
    .searchIndex("search_notes", {
      searchField: "notesText",
      filterFields: ["userId"],
    }),

  trialEmails: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index("byEmail", ["email"]),
});
