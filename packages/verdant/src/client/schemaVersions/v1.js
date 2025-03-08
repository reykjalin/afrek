/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
import { createTipTapFieldSchema } from "@verdant-web/tiptap";
import { createId } from "@paralleldrive/cuid2";
var notes = schema.collection({
  name: "note",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: createId
    }),
    content: createTipTapFieldSchema({
      default: {
        type: "doc",
        content: []
      }
    }),
    isTask: schema.fields.boolean({
      default: false
    }),
    done: schema.fields.boolean({
      default: false
    }),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    completedAt: schema.fields.number({
      default: () => Date.now()
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    }
  }
});
var schema_default = schema({
  version: 1,
  collections: {
    notes
  }
});
export {
  schema_default as default
};
