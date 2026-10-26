import { z } from "zod";
import { definePlainTextTask } from "./types";
import { buildSystemPrompt, buildUserContent } from "./shared";

export const humanizeOptionsSchema = z.object({
  tone: z.enum(["casual", "professional", "conversational"]).default("conversational"),
  strength: z.number().int().min(1).max(5).default(3),
  protectedPhrases: z.array(z.string().max(200)).max(25).default([]),
  preserveQuotes: z.boolean().default(true),
  preserveCitations: z.boolean().default(true),
  preserveFormatting: z.boolean().default(true),
});

export type HumanizeOptions = z.infer<typeof humanizeOptionsSchema>;

const STRENGTH_DESCRIPTIONS: Record<number, string> = {
  1: "Make only light touch-ups: fix awkward phrasing but keep sentence structure very close to the original.",
  2: "Make modest revisions: smooth out stiff phrasing while keeping most sentence structures intact.",
  3: "Rewrite moderately: vary sentence structure and word choice noticeably while keeping the same points in the same order.",
  4: "Rewrite substantially: restructure sentences and paragraphs more freely for a natural, human voice.",
  5: "Rewrite thoroughly: feel free to reorganize sentences significantly for maximum natural flow, while keeping every fact and point.",
};

export const humanizeTask = definePlainTextTask<HumanizeOptions>({
  id: "humanize",
  label: "AI Text Humanizer",
  optionsSchema: humanizeOptionsSchema,
  buildPrompt(text, options) {
    const preserveList: string[] = [];
    if (options.preserveQuotes) preserveList.push("any text inside quotation marks, exactly as written");
    if (options.preserveCitations) preserveList.push("citations, references, and source attributions");
    if (options.preserveFormatting) preserveList.push("existing paragraph breaks, lists, and formatting structure");

    const roleInstruction = [
      `You improve writing so it reads with more natural, human wording and less repetitive or generic phrasing.`,
      `Target tone: ${options.tone}.`,
      STRENGTH_DESCRIPTIONS[options.strength] ?? STRENGTH_DESCRIPTIONS[3],
      preserveList.length > 0
        ? `Preserve exactly, without rewriting: ${preserveList.join("; ")}.`
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      systemPrompt: buildSystemPrompt({
        roleInstruction,
        protectedPhrases: options.protectedPhrases,
        includeNoDetectionEvasionNote: true,
      }),
      userContent: buildUserContent(text),
      temperature: 0.6,
    };
  },
});
