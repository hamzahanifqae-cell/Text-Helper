import { countWords } from "./counters";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "so", "of", "to", "in",
  "on", "at", "for", "with", "as", "by", "is", "are", "was", "were", "be",
  "been", "being", "it", "its", "this", "that", "these", "those", "i", "you",
  "he", "she", "we", "they", "them", "his", "her", "their", "our", "your",
  "not", "no", "do", "does", "did", "have", "has", "had", "will", "would",
  "can", "could", "should", "may", "might", "from", "into", "than", "too",
  "very", "just", "about", "up", "down", "out", "over", "under", "again",
]);

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9']+/g) ?? []);
}

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export function wordFrequency(text: string, excludeStopwords = true, limit = 50): WordFrequency[] {
  const tokens = tokenize(text).filter((t) => (excludeStopwords ? !STOPWORDS.has(t) : true));
  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  const total = tokens.length || 1;
  return Array.from(counts.entries())
    .map(([word, count]) => ({ word, count, percentage: round1((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export interface RepeatedPhrase {
  phrase: string;
  count: number;
  wordsInPhrase: number;
}

export function repeatedPhrases(text: string, sizes: number[] = [2, 3, 4], minCount = 2): RepeatedPhrase[] {
  const tokens = tokenize(text);
  const results: RepeatedPhrase[] = [];
  for (const n of sizes) {
    const counts = new Map<string, number>();
    for (let i = 0; i + n <= tokens.length; i++) {
      const phrase = tokens.slice(i, i + n).join(" ");
      counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
    }
    for (const [phrase, count] of counts) {
      if (count >= minCount) results.push({ phrase, count, wordsInPhrase: n });
    }
  }
  return results.sort((a, b) => b.count - a.count).slice(0, 50);
}

export function vocabularyVariety(text: string): { uniqueWords: number; totalWords: number; typeTokenRatio: number } {
  const tokens = tokenize(text);
  const unique = new Set(tokens);
  const total = tokens.length;
  return {
    uniqueWords: unique.size,
    totalWords: total,
    typeTokenRatio: total > 0 ? round1((unique.size / total) * 100) : 0,
  };
}

export interface KeywordStats {
  keyword: string;
  occurrences: number;
  density: number;
}

export function keywordStats(text: string, keyword: string): KeywordStats {
  const trimmed = keyword.trim().toLowerCase();
  if (!trimmed) return { keyword, occurrences: 0, density: 0 };
  const tokens = tokenize(text);
  const keywordTokens = tokenize(trimmed);
  let occurrences = 0;
  if (keywordTokens.length === 1) {
    occurrences = tokens.filter((t) => t === keywordTokens[0]).length;
  } else if (keywordTokens.length > 1) {
    for (let i = 0; i + keywordTokens.length <= tokens.length; i++) {
      const slice = tokens.slice(i, i + keywordTokens.length).join(" ");
      if (slice === keywordTokens.join(" ")) occurrences++;
    }
  }
  const totalWords = Math.max(1, countWords(text));
  return { keyword, occurrences, density: round1((occurrences / totalWords) * 100) };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
