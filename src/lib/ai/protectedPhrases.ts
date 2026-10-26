export interface ProtectedPhraseCheck {
  phrase: string;
  preserved: boolean;
}

// Checks (after the fact) whether each user-designated phrase still appears
// verbatim in the model's output. This cannot force preservation - it can
// only verify it and let the UI honestly report any phrase that didn't make
// it through, rather than silently claiming protection worked.
export function verifyProtectedPhrases(output: string, phrases: string[]): ProtectedPhraseCheck[] {
  return phrases
    .map((p) => p.trim())
    .filter(Boolean)
    .map((phrase) => ({ phrase, preserved: output.includes(phrase) }));
}

export function buildProtectedPhrasesInstruction(phrases: string[]): string {
  const cleaned = phrases.map((p) => p.trim()).filter(Boolean);
  if (cleaned.length === 0) return "";
  const list = cleaned.map((p) => `"${p}"`).join(", ");
  return `\n\nThe following exact phrases must be preserved verbatim, character-for-character, wherever they appear in the output - do not rewrite, translate, or paraphrase them: ${list}.`;
}
