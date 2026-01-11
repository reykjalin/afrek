import { internalMutation } from "../_generated/server";

/**
 * Extract plain text from Plate.js JSON value.
 * Duplicated here to avoid importing client-side modules into Convex.
 */
function richTextJsonToText(json: string): string {
  if (!json || json.trim() === "") return "";
  try {
    const value = JSON.parse(json);
    if (!Array.isArray(value) || value.length === 0) return "";

    const extractText = (node: unknown): string => {
      if (typeof node === "object" && node !== null) {
        const nodeObj = node as Record<string, unknown>;
        if (typeof nodeObj.text === "string") return nodeObj.text;
        if (Array.isArray(nodeObj.children)) {
          return nodeObj.children.map(extractText).join("");
        }
      }
      return "";
    };

    return value.map(extractText).join("\n");
  } catch {
    return "";
  }
}

/**
 * Migration to backfill titleText and notesText fields for existing tasks.
 * Run this once after deploying the schema changes.
 *
 * Usage: npx convex run migrations/backfillPlaintext:backfillPlaintextFields
 */
export const backfillPlaintextFields = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();

    let updated = 0;
    let skipped = 0;

    for (const task of tasks) {
      if (task.encryptedPayload) {
        skipped++;
        continue;
      }

      const titleText = task.titleText;
      const notesText = task.notesText;

      if (titleText !== undefined && notesText !== undefined) {
        skipped++;
        continue;
      }

      const newTitleText = richTextJsonToText(task.titleJson || "");
      const newNotesText = richTextJsonToText(task.notesJson || "");

      await ctx.db.patch(task._id, {
        titleText: newTitleText,
        notesText: newNotesText,
      });

      updated++;
    }

    return { updated, skipped, total: tasks.length };
  },
});
