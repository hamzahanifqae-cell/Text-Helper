import { getTool, getToolsByCategory, type ToolMeta } from "@/lib/registry/tools";

/** Complementary tools, chosen because they answer a nearby task. */
const RELATED: Record<string, string[]> = {
  "word-counter": ["character-counter", "reading-time-calculator", "text-cleaner"],
  "character-counter": ["word-counter", "text-cleaner", "case-converter"],
  "reading-time-calculator": ["word-counter", "readability-checker", "text-summarizer"],
  "grammar-checker": ["text-cleaner", "paraphrasing-tool", "readability-checker"],
  "ai-text-humanizer": ["paraphrasing-tool", "tone-changer", "ai-writing-pattern-analysis"],
  "paraphrasing-tool": ["text-simplifier", "tone-changer", "grammar-checker"],
  "text-simplifier": ["paraphrasing-tool", "readability-checker", "text-summarizer"],
  "text-shortener": ["text-summarizer", "text-expander", "paraphrasing-tool"],
  "text-expander": ["text-shortener", "paraphrasing-tool", "outline-generator"],
  "tone-changer": ["formal-informal-converter", "paraphrasing-tool", "ai-text-humanizer"],
  "formal-informal-converter": ["tone-changer", "paraphrasing-tool", "grammar-checker"],
  "active-voice-converter": ["paraphrasing-tool", "grammar-checker", "flow-consistency-improver"],
  "flow-consistency-improver": ["paraphrasing-tool", "grammar-checker", "readability-checker"],
  "inclusive-language-checker": ["tone-changer", "paraphrasing-tool", "grammar-checker"],
  "headline-generator": ["introduction-generator", "text-summarizer", "paraphrasing-tool"],
  "introduction-generator": ["conclusion-generator", "outline-generator", "headline-generator"],
  "conclusion-generator": ["introduction-generator", "text-summarizer", "outline-generator"],
  "outline-generator": ["text-summarizer", "introduction-generator", "headline-generator"],
  "text-summarizer": ["text-shortener", "outline-generator", "reading-time-calculator"],
  "ai-writing-pattern-analysis": ["readability-checker", "ai-text-humanizer", "grammar-checker"],
  "readability-checker": ["reading-time-calculator", "text-simplifier", "word-counter"],
  "keyword-density-analyzer": ["word-counter", "readability-checker", "text-compare"],
  "text-cleaner": ["case-converter", "list-line-tools", "word-counter"],
  "case-converter": ["text-cleaner", "find-and-replace", "word-counter"],
  "find-and-replace": ["text-cleaner", "text-compare", "case-converter"],
  "text-compare": ["find-and-replace", "word-counter", "list-line-tools"],
  "list-line-tools": ["text-cleaner", "text-compare", "find-and-replace"],
  "text-extractor": ["privacy-redactor", "list-line-tools", "text-cleaner"],
  "privacy-redactor": ["text-extractor", "text-cleaner", "find-and-replace"],
  "markdown-editor": ["html-escape-tool", "text-cleaner", "word-counter"],
  "html-escape-tool": ["url-encoder-decoder", "markdown-editor", "text-cleaner"],
  "url-encoder-decoder": ["html-escape-tool", "text-cleaner", "find-and-replace"],
};

export function getRelatedTools(slug: string): ToolMeta[] {
  const preferred = (RELATED[slug] ?? [])
    .map((relatedSlug) => getTool(relatedSlug))
    .filter((tool): tool is ToolMeta => Boolean(tool));
  if (preferred.length >= 3) return preferred.slice(0, 3);

  const current = getTool(slug);
  if (!current) return preferred;
  const extras = getToolsByCategory(current.category).filter(
    (tool) => tool.slug !== slug && !preferred.some((related) => related.slug === tool.slug),
  );
  return [...preferred, ...extras].slice(0, 3);
}
