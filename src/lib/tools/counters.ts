// Text counting utilities.
//
// Counting rules and limitations (surfaced to users on the tool page):
// - Words are detected with Intl.Segmenter (word granularity) and counting
//   only "word-like" segments. This handles Unicode scripts (CJK, Arabic,
//   Cyrillic, etc.) far better than splitting on whitespace, but languages
//   written without spaces (e.g. Chinese, Japanese, Thai) will still only be
//   an approximation of what a native speaker would call a "word".
// - Characters are counted as user-perceived graphemes (Intl.Segmenter,
//   grapheme granularity), so a flag emoji or an accented character built
//   from combining marks counts as one character, not two or more.
// - Sentences are detected with punctuation heuristics (./!/?) followed by
//   whitespace or end of text. Abbreviations ("Mr.", "e.g.") and decimal
//   numbers can cause over- or under-counting; this is a heuristic, not a
//   full NLP sentence boundary detector.
// - Paragraphs are blocks of text separated by one or more blank lines.
// - Reading time assumes 200 words per minute (silent reading, adult,
//   English-language average). Speaking time assumes 130 words per minute
//   (average conversational pace). Both are estimates and will be off for
//   technical text, other languages, or different reading/speaking speeds.

export interface TextStats {
  words: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
}

const READING_WPM = 200;
const SPEAKING_WPM = 130;

function hasSegmenter(): boolean {
  return typeof Intl !== "undefined" && "Segmenter" in Intl;
}

export function countWords(text: string): number {
  if (!text) return 0;
  if (hasSegmenter()) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
    let count = 0;
    for (const { isWordLike } of segmenter.segment(text)) {
      if (isWordLike) count++;
    }
    return count;
  }
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function countGraphemes(text: string): number {
  if (!text) return 0;
  if (hasSegmenter()) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text)).length;
  }
  return Array.from(text).length;
}

export function countCharactersWithoutSpaces(text: string): number {
  return countGraphemes(text.replace(/\s/g, ""));
}

export function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const matches = trimmed.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g);
  if (!matches) return trimmed.length > 0 ? 1 : 0;
  return matches.filter((s) => s.trim().length > 0).length;
}

export function countParagraphs(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean).length;
}

export function countLines(text: string): number {
  if (text === "") return 0;
  return text.split(/\n/).length;
}

export function computeTextStats(text: string): TextStats {
  const words = countWords(text);
  return {
    words,
    charactersWithSpaces: countGraphemes(text),
    charactersWithoutSpaces: countCharactersWithoutSpaces(text),
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    lines: countLines(text),
    readingTimeSeconds: Math.ceil((words / READING_WPM) * 60),
    speakingTimeSeconds: Math.ceil((words / SPEAKING_WPM) * 60),
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes < 60) return rest > 0 ? `${minutes} min ${rest} sec` : `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return restMinutes > 0 ? `${hours} hr ${restMinutes} min` : `${hours} hr`;
}
