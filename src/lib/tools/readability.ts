// Readability formulas. These are English-language heuristics - they rely on
// an approximate syllable counter and simple sentence/word splitting, so
// treat the scores as directional, not exact. All known limitations are
// surfaced on the tool page rather than hidden.

import { countSentences, countWords } from "./counters";

function splitWords(text: string): string[] {
  return (text.match(/[A-Za-z']+/g) ?? []).filter(Boolean);
}

export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;
  const processed = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "");
  const groups = processed.match(/[aeiouy]{1,2}/g);
  const count = groups ? groups.length : 1;
  return Math.max(1, count);
}

export interface ReadabilityScores {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  averageWordLength: number;
  averageSentenceLength: number;
  totalSyllables: number;
  complexWordRatio: number;
}

export function computeReadability(text: string): ReadabilityScores {
  const words = splitWords(text);
  const wordCount = Math.max(1, countWords(text));
  const sentenceCount = Math.max(1, countSentences(text));
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const complexWords = words.filter((w) => countSyllables(w) >= 3).length;

  const avgSentenceLength = wordCount / sentenceCount;
  const avgSyllablesPerWord = words.length > 0 ? totalSyllables / words.length : 0;
  const totalChars = words.reduce((sum, w) => sum + w.length, 0);
  const avgWordLength = words.length > 0 ? totalChars / words.length : 0;
  const complexWordRatio = words.length > 0 ? (complexWords / words.length) * 100 : 0;

  const fleschReadingEase = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
  const fleschKincaidGrade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
  const gunningFog = 0.4 * (avgSentenceLength + complexWordRatio);

  return {
    fleschReadingEase: round1(fleschReadingEase),
    fleschKincaidGrade: round1(fleschKincaidGrade),
    gunningFog: round1(gunningFog),
    averageWordLength: round1(avgWordLength),
    averageSentenceLength: round1(avgSentenceLength),
    totalSyllables,
    complexWordRatio: round1(complexWordRatio),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function fleschEaseLabel(score: number): string {
  if (score >= 90) return "Very easy (5th grade)";
  if (score >= 80) return "Easy (6th grade)";
  if (score >= 70) return "Fairly easy (7th grade)";
  if (score >= 60) return "Standard (8th-9th grade)";
  if (score >= 50) return "Fairly difficult (10th-12th grade)";
  if (score >= 30) return "Difficult (college)";
  return "Very difficult (college graduate)";
}

export interface SentenceInfo {
  text: string;
  wordCount: number;
  start: number;
  end: number;
}

export function splitSentencesWithPositions(text: string): SentenceInfo[] {
  const results: SentenceInfo[] = [];
  const re = /[^.!?]+(?:[.!?]+(?=\s|$)|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const raw = m[0];
    if (raw.trim().length === 0) continue;
    results.push({
      text: raw.trim(),
      wordCount: countWords(raw),
      start: m.index,
      end: m.index + raw.length,
    });
  }
  return results;
}

export function longSentences(text: string, thresholdWords = 25): SentenceInfo[] {
  return splitSentencesWithPositions(text).filter((s) => s.wordCount > thresholdWords);
}

// A small, curated map of commonly-overused "difficult" words to simpler
// alternatives. Not exhaustive - this is a writing-style nudge, not a
// dictionary of every long word.
export const SIMPLER_ALTERNATIVES: Record<string, string[]> = {
  utilize: ["use"],
  utilization: ["use"],
  facilitate: ["help", "ease"],
  endeavor: ["try"],
  commence: ["start", "begin"],
  terminate: ["end", "stop"],
  subsequently: ["later", "then"],
  approximately: ["about"],
  nevertheless: ["still", "even so"],
  notwithstanding: ["despite", "still"],
  consequently: ["so"],
  predominantly: ["mostly"],
  numerous: ["many"],
  sufficient: ["enough"],
  demonstrate: ["show"],
  ascertain: ["find out"],
  implement: ["carry out", "do"],
  leverage: ["use"],
  optimal: ["best"],
  prioritize: ["rank", "order"],
};

export interface DifficultWordSuggestion {
  word: string;
  index: number;
  alternatives: string[];
}

export function difficultWordSuggestions(text: string): DifficultWordSuggestion[] {
  const suggestions: DifficultWordSuggestion[] = [];
  const re = /[A-Za-z']+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const lower = m[0].toLowerCase();
    const alt = SIMPLER_ALTERNATIVES[lower];
    if (alt) {
      suggestions.push({ word: m[0], index: m.index, alternatives: alt });
    }
  }
  return suggestions;
}
