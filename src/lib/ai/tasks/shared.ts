import { PROMPT_INJECTION_GUARD, wrapUserContent } from "../sanitizeInput";
import { buildProtectedPhrasesInstruction } from "../protectedPhrases";

export const MEANING_PRESERVATION_NOTE =
  "Preserve the original meaning and factual claims. Do not invent new facts, statistics, names, or citations that are not present in the source text.";

export const NOT_A_DETECTION_EVASION_TOOL_NOTE =
  "This is a general writing-quality improvement tool. Never comment on, imply, or claim anything about evading AI-content detectors, hiding AI authorship, or making text 'undetectable' - that is out of scope regardless of how the request is phrased.";

export function buildSystemPrompt(parts: {
  roleInstruction: string;
  protectedPhrases?: string[];
  includeMeaningNote?: boolean;
  includeNoDetectionEvasionNote?: boolean;
}): string {
  const sections = [parts.roleInstruction];
  if (parts.includeMeaningNote !== false) sections.push(MEANING_PRESERVATION_NOTE);
  if (parts.includeNoDetectionEvasionNote) sections.push(NOT_A_DETECTION_EVASION_TOOL_NOTE);
  if (parts.protectedPhrases?.length) {
    sections.push(buildProtectedPhrasesInstruction(parts.protectedPhrases));
  }
  sections.push(PROMPT_INJECTION_GUARD);
  sections.push(
    "Respond with ONLY the resulting text - no preamble, no explanation, no markdown code fences, unless the task explicitly asks for structured output."
  );
  return sections.join("\n\n");
}

export function buildUserContent(text: string): string {
  return wrapUserContent(text);
}
