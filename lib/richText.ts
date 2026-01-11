import type { Value } from "platejs";

/**
 * Extract plain text from a Plate.js Value.
 * Used for search indexing and display in contexts where rich text isn't supported.
 */
export function richTextValueToText(value: Value): string {
  if (!value || value.length === 0) return "";

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
}

/**
 * Parse a JSON string to a Plate.js Value and extract plain text.
 * Returns empty string for invalid or empty JSON.
 */
export function richTextJsonToText(json: string): string {
  if (!json || json.trim() === "") return "";
  try {
    const value = JSON.parse(json) as Value;
    return richTextValueToText(value);
  } catch {
    return "";
  }
}
