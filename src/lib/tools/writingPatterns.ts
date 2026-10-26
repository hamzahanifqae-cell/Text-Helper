// Deterministic writing-pattern signals for the experimental "AI Writing
// Pattern Analysis" tool. This module computes stylistic metrics only - it
// never produces, and must never be made to produce, a calibrated
// probability that text is "AI-generated" or "human-written". No suitably
// licensed, independently-evaluated AI-authorship detector was available
// within this project's free-tier/low-memory hosting constraints, so this
// tool reports writing-style signals instead of a fabricated authorship
// score. See the tool page copy for the full honesty disclosure.

import { splitSentencesWithPositions } from "./readability";
import { vocabularyVariety } from "./keywordAnalysis";

const TRANSITION_WORDS = [
  "however", "therefore", "moreover", "furthermore", "additionally",
  "consequently", "nevertheless", "nonetheless", "meanwhile", "thus",
  "accordingly", "subsequently", "in addition", "on the other hand",
  "as a result", "in conclusion", "for example", "for instance",
  "in other words", "in summary", "overall", "ultimately",
];

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export interface WritingPatternReport {
  sentenceCount: number;
  averageSentenceLength: number;
  sentenceLengthStdDev: number;
  /** "Burstiness": variation in sentence length. Human writing tends to vary more; very uniform sentence lengths are one (weak) stylistic signal among many - not proof of anything on their own. */
  burstiness: number;
  vocabularyTypeTokenRatio: number;
  transitionWordDensityPer100Words: number;
  repeatedSentenceStarters: Array<{ starter: string; count: number }>;
  longestSentenceWords: number;
  shortestSentenceWords: number;
}

function sentenceStarter(sentenceText: string): string {
  const match = sentenceText.trim().match(/^[A-Za-z']+/);
  return match ? match[0].toLowerCase() : "";
}

export function analyzeWritingPatterns(text: string): WritingPatternReport {
  const sentences = splitSentencesWithPositions(text);
  const lengths = sentences.map((s) => s.wordCount);
  const totalWords = lengths.reduce((a, b) => a + b, 0) || 1;
  const avg = lengths.length > 0 ? totalWords / lengths.length : 0;
  const std = stdDev(lengths);

  const transitionMatches = TRANSITION_WORDS.reduce((count, phrase) => {
    const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const found = text.match(re);
    return count + (found ? found.length : 0);
  }, 0);

  const starterCounts = new Map<string, number>();
  for (const s of sentences) {
    const starter = sentenceStarter(s.text);
    if (!starter) continue;
    starterCounts.set(starter, (starterCounts.get(starter) ?? 0) + 1);
  }
  const repeatedSentenceStarters = Array.from(starterCounts.entries())
    .filter(([, count]) => count >= 3)
    .map(([starter, count]) => ({ starter, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const variety = vocabularyVariety(text);

  return {
    sentenceCount: sentences.length,
    averageSentenceLength: round1(avg),
    sentenceLengthStdDev: round1(std),
    burstiness: round1(avg > 0 ? std / avg : 0),
    vocabularyTypeTokenRatio: variety.typeTokenRatio,
    transitionWordDensityPer100Words: round1((transitionMatches / totalWords) * 100),
    repeatedSentenceStarters,
    longestSentenceWords: lengths.length > 0 ? Math.max(...lengths) : 0,
    shortestSentenceWords: lengths.length > 0 ? Math.min(...lengths) : 0,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
