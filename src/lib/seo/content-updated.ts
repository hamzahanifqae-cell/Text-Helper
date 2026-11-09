/**
 * Date of the last significant change to public page content (copy, links,
 * or structured data). This is not the build time. Update it only when the
 * indexed pages actually change.
 */
export const CONTENT_UPDATED = new Date("2026-11-05T00:00:00.000Z");

/** Later edits on 5 November 2026. Other tool pages keep the earlier time. */
export const TOOL_CONTENT_UPDATED: Record<string, Date> = {
  "active-voice-converter": new Date("2026-11-05T14:46:00.000Z"),
  "conclusion-generator": new Date("2026-11-05T14:46:00.000Z"),
  "formal-informal-converter": new Date("2026-11-05T14:46:00.000Z"),
  "ai-text-humanizer": new Date("2026-11-09T00:00:00.000Z"),
  "ai-writing-pattern-analysis": new Date("2026-11-09T00:00:00.000Z"),
};

/** Pages whose visible copy changed on 9 November 2026. */
export const PAGE_UPDATED_9_NOV = new Date("2026-11-09T00:00:00.000Z");
