import { schema } from "@verdant-web/store";
import { createTipTapFieldSchema } from "@verdant-web/tiptap";
import { createId } from "@paralleldrive/cuid2";

/**
 * Welcome to your Verdant schema!
 *
 * The schema is where you define your data model.
 *
 * Read more at https://verdant.dev/docs/local-storage/schema
 *
 * The code below is provided as an example, but you'll
 * probably want to delete it and replace it with your
 * own schema.
 *
 * The schema is used to generate the client code for Verdant.
 * After you've replaced this example schema, run `pnpm generate -f`
 * in the root directory to bootstrap your client.
 *
 * For subsequent changes to your schema, use just `pnpm generate`.
 */

const notes = schema.collection({
  name: "note",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: createId,
    }),
    content: createTipTapFieldSchema({
      default: {
        type: "doc",
        content: [],
      },
    }),
    isTask: schema.fields.boolean({
      default: false,
    }),
    done: schema.fields.boolean({
      default: false,
    }),
    createdAt: schema.fields.number({
      default: () => Date.now(),
    }),
    completedAt: schema.fields.number({
      default: () => Date.now(),
    }),
  },
  indexes: {
    createdAt: {
      field: "createdAt",
    },
  },
});

export default schema({
  version: 1,
  collections: {
    notes,
  },
});
