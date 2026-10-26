import { z } from "zod";
import { definePlainTextTask } from "./types";
import { buildSystemPrompt, buildUserContent } from "./shared";

export const summarizeOptionsSchema = z.object({
  format: z.enum(["paragraph", "bullets", "keyPoints"]).default("paragraph"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
});

export type SummarizeOptions = z.infer<typeof summarizeOptionsSchema>;

const LENGTH_HINT: Record<SummarizeOptions["length"], string> = {
  short: "very brief (roughly 1-2 sentences or 3 bullet points)",
  medium: "moderate length (roughly 3-5 sentences or 5-7 bullet points)",
  long: "more thorough (roughly 6-10 sentences or 8-12 bullet points), while still clearly shorter than the source",
};

const FORMAT_HINT: Record<SummarizeOptions["format"], string> = {
  paragraph: "Write it as flowing paragraph text.",
  bullets: "Format it as a bulleted list, one point per line starting with '-'.",
  keyPoints: "Extract only the key points as a bulleted list, one per line starting with '-', each as short as possible while staying clear.",
};

export const summarizeTask = definePlainTextTask<SummarizeOptions>({
  id: "summarize",
  label: "Text Summarizer",
  optionsSchema: summarizeOptionsSchema,
  buildPrompt(text, options) {
    const roleInstruction = [
      `Summarize the content below. Length: ${LENGTH_HINT[options.length]}.`,
      FORMAT_HINT[options.format],
      "Only summarize what is actually stated in the content - never add facts, statistics, quotes, or citations that are not present in the source text.",
    ].join(" ");
    return {
      systemPrompt: buildSystemPrompt({ roleInstruction, includeMeaningNote: false }),
      userContent: buildUserContent(text),
      temperature: 0.3,
    };
  },
});
