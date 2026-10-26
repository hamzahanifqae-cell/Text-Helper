import { z } from "zod";
import { AITaskDefinition } from "./types";
import { PROMPT_INJECTION_GUARD, wrapUserContent } from "../sanitizeInput";

export const grammarDeepOptionsSchema = z.object({
  variant: z.enum(["US", "UK"]).default("US"),
});

export type GrammarDeepOptions = z.infer<typeof grammarDeepOptionsSchema>;

const rawSuggestionSchema = z.object({
  original: z.string().min(1).max(400),
  suggestion: z.string().max(400),
  explanation: z.string().max(400),
});
const rawSuggestionArraySchema = z.array(rawSuggestionSchema).max(60);

export interface AiGrammarSuggestion {
  start: number;
  end: number;
  original: string;
  suggestion: string;
  explanation: string;
}

export interface GrammarDeepResult {
  suggestions: AiGrammarSuggestion[];
  parseError: boolean;
}

function extractJsonArray(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? raw;
  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return candidate;
  return candidate.slice(start, end + 1);
}

export const grammarDeepTask: AITaskDefinition<GrammarDeepOptions> = {
  id: "grammar-deep",
  label: "AI Deeper Grammar Suggestions",
  optionsSchema: grammarDeepOptionsSchema,
  buildPrompt(text, options) {
    const systemPrompt = [
      `You find grammar, clarity, and word-choice issues in writing that simple pattern-matching checks miss (not spelling typos or repeated words - those are already handled separately).`,
      `Write for ${options.variant} English spelling conventions.`,
      `Respond with ONLY a JSON array (no markdown fences, no commentary). Each element must be an object: {"original": <exact substring copied verbatim from the input text>, "suggestion": <replacement text>, "explanation": <short plain-language reason, one sentence>}.`,
      `"original" MUST be copied character-for-character from the input - do not paraphrase it - because it is used to locate the issue in the source text. If you find no issues, respond with exactly: []`,
      `Report at most 20 of the most useful issues.`,
      PROMPT_INJECTION_GUARD,
    ].join("\n\n");
    return {
      systemPrompt,
      userContent: wrapUserContent(text),
      temperature: 0.2,
      maxOutputTokens: 1200,
    };
  },
  postProcess(rawOutput, text): GrammarDeepResult {
    try {
      const jsonText = extractJsonArray(rawOutput);
      const parsed = rawSuggestionArraySchema.parse(JSON.parse(jsonText));
      const suggestions: AiGrammarSuggestion[] = [];
      for (const item of parsed) {
        const index = text.indexOf(item.original);
        if (index === -1) continue; // can't safely locate this one - drop it rather than guess
        suggestions.push({
          start: index,
          end: index + item.original.length,
          original: item.original,
          suggestion: item.suggestion,
          explanation: item.explanation,
        });
      }
      return { suggestions, parseError: false };
    } catch {
      return { suggestions: [], parseError: true };
    }
  },
};
