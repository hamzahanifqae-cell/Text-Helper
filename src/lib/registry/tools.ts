export type ToolKind = "local" | "ai";

export interface ToolMeta {
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  kind: ToolKind;
  icon: string;
  popular?: boolean;
  experimental?: boolean;
  keywords?: string[];
}

export const TOOLS: ToolMeta[] = [
  // Counters
  { slug: "word-counter", title: "Word Counter", shortDescription: "Count words, characters, sentences, and estimate reading/speaking time.", category: "counters", kind: "local", icon: "Hash", popular: true, keywords: ["count words", "text stats"] },
  { slug: "character-counter", title: "Character Counter", shortDescription: "Character count with and without spaces, plus full text statistics.", category: "counters", kind: "local", icon: "Rows3", keywords: ["char count", "letter count"] },
  { slug: "reading-time-calculator", title: "Reading Time Calculator", shortDescription: "Estimate reading and speaking time for your text.", category: "counters", kind: "local", icon: "Clock", keywords: ["speaking time", "wpm"] },

  // Grammar
  { slug: "grammar-checker", title: "Grammar Checker", shortDescription: "Spelling, punctuation, repeated-word, and US/UK checks, plus optional deeper AI suggestions.", category: "grammar", kind: "local", icon: "SpellCheck", popular: true, keywords: ["spell check", "proofread"] },

  // Humanizer
  { slug: "ai-text-humanizer", title: "AI Text Humanizer", shortDescription: "Rewrite stiff or AI-sounding text with more natural wording and tone.", category: "humanizer", kind: "ai", icon: "Sparkles", popular: true, keywords: ["humanize ai text", "natural writing"] },

  // Rewriting assistants
  { slug: "paraphrasing-tool", title: "Paraphrasing Tool", shortDescription: "Reword text while keeping the same meaning.", category: "rewriting", kind: "ai", icon: "Repeat", popular: true, keywords: ["paraphrase", "reword"] },
  { slug: "text-simplifier", title: "Text Simplifier", shortDescription: "Rewrite in simpler, clearer language.", category: "rewriting", kind: "ai", icon: "Feather", keywords: ["simplify", "plain language"] },
  { slug: "text-shortener", title: "Text Shortener", shortDescription: "Condense text while keeping every key point.", category: "rewriting", kind: "ai", icon: "Scissors", keywords: ["shorten", "condense"] },
  { slug: "text-expander", title: "Text Expander", shortDescription: "Add detail and elaboration to short text.", category: "rewriting", kind: "ai", icon: "Expand", keywords: ["expand", "elaborate"] },
  { slug: "tone-changer", title: "Tone Changer", shortDescription: "Shift text to a formal, casual, friendly, or other tone.", category: "rewriting", kind: "ai", icon: "SlidersHorizontal", keywords: ["tone", "rewrite tone"] },
  { slug: "formal-informal-converter", title: "Formal / Informal Converter", shortDescription: "Convert between formal and informal register.", category: "rewriting", kind: "ai", icon: "ArrowLeftRight", keywords: ["formal", "informal"] },
  { slug: "active-voice-converter", title: "Active Voice Converter", shortDescription: "Turn passive-voice sentences into active voice.", category: "rewriting", kind: "ai", icon: "Zap", keywords: ["active voice", "passive voice"] },
  { slug: "flow-consistency-improver", title: "Flow & Consistency Improver", shortDescription: "Smooth transitions and keep tense and terms consistent.", category: "rewriting", kind: "ai", icon: "Waves", keywords: ["flow", "consistency"] },
  { slug: "inclusive-language-checker", title: "Inclusive Language Checker", shortDescription: "Flag and rewrite exclusionary language.", category: "rewriting", kind: "ai", icon: "Users", keywords: ["inclusive language"] },
  { slug: "headline-generator", title: "Headline Generator", shortDescription: "Generate several headline options from your content.", category: "rewriting", kind: "ai", icon: "Heading", keywords: ["headline", "title generator"] },
  { slug: "introduction-generator", title: "Introduction Generator", shortDescription: "Write an opening paragraph for your content.", category: "rewriting", kind: "ai", icon: "AlignLeft", keywords: ["intro generator"] },
  { slug: "conclusion-generator", title: "Conclusion Generator", shortDescription: "Write a closing paragraph for your content.", category: "rewriting", kind: "ai", icon: "AlignRight", keywords: ["conclusion generator"] },
  { slug: "outline-generator", title: "Outline Generator", shortDescription: "Turn your content into a structured outline.", category: "rewriting", kind: "ai", icon: "ListTree", keywords: ["outline generator"] },

  // Summarization
  { slug: "text-summarizer", title: "Text Summarizer", shortDescription: "Summarize text as a paragraph, bullet list, or key points.", category: "summarization", kind: "ai", icon: "FileText", popular: true, keywords: ["summarize", "tldr"] },

  // AI detection (experimental)
  { slug: "ai-writing-pattern-analysis", title: "AI Writing Pattern Analysis", shortDescription: "Experimental writing-style signals - not an AI-authorship verdict.", category: "ai-detection", kind: "local", icon: "Microscope", experimental: true, keywords: ["ai detector", "ai content detector"] },

  // Readability
  { slug: "readability-checker", title: "Readability Checker", shortDescription: "Flesch, Flesch-Kincaid, and Gunning Fog scores with explanations.", category: "readability", kind: "local", icon: "BookOpen", keywords: ["flesch score", "readability"] },
  { slug: "keyword-density-analyzer", title: "Keyword Density Analyzer", shortDescription: "Word frequency, repeated phrases, and keyword density.", category: "readability", kind: "local", icon: "BarChart3", keywords: ["keyword density", "word frequency"] },

  // Cleanup
  { slug: "text-cleaner", title: "Text Cleaner", shortDescription: "Remove extra spaces, empty lines, duplicate lines, and HTML tags.", category: "cleanup", kind: "local", icon: "Eraser", popular: true, keywords: ["remove extra spaces", "clean text"] },

  // Case
  { slug: "case-converter", title: "Case Converter", shortDescription: "Upper, lower, sentence, title, and toggle case.", category: "case", kind: "local", icon: "CaseSensitive", popular: true, keywords: ["uppercase", "lowercase", "title case"] },

  // Find/replace/compare
  { slug: "find-and-replace", title: "Find and Replace", shortDescription: "Find and replace words or phrases with preview.", category: "compare", kind: "local", icon: "Search", keywords: ["find replace"] },
  { slug: "text-compare", title: "Text Compare", shortDescription: "Highlight additions, deletions, and changes between two texts.", category: "compare", kind: "local", icon: "GitCompare", popular: true, keywords: ["diff text", "compare text"] },

  // List tools
  { slug: "list-line-tools", title: "List & Line Tools", shortDescription: "Sort, reverse, number, deduplicate lines, and add/remove prefixes or suffixes.", category: "lists", kind: "local", icon: "ListOrdered", keywords: ["sort lines", "number lines"] },

  // Extraction/privacy
  { slug: "text-extractor", title: "Text Extractor", shortDescription: "Extract emails, URLs, hashtags, and numbers from text.", category: "privacy", kind: "local", icon: "Filter", keywords: ["extract emails", "extract urls"] },
  { slug: "privacy-redactor", title: "Privacy Redactor", shortDescription: "Find and redact recognizable emails and phone numbers.", category: "privacy", kind: "local", icon: "ShieldCheck", keywords: ["redact", "remove personal info"] },

  // Formatting
  { slug: "markdown-editor", title: "Markdown Editor", shortDescription: "Write Markdown with a live, sanitized preview.", category: "formatting", kind: "local", icon: "FileCode", keywords: ["markdown preview"] },
  { slug: "html-escape-tool", title: "HTML Escape / Unescape", shortDescription: "Escape or unescape HTML entities.", category: "formatting", kind: "local", icon: "Code2", keywords: ["html entities"] },
  { slug: "url-encoder-decoder", title: "URL Encoder / Decoder", shortDescription: "Encode or decode URL components.", category: "formatting", kind: "local", icon: "Link2", keywords: ["url encode", "percent encoding"] },
];

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getPopularTools(): ToolMeta[] {
  return TOOLS.filter((t) => t.popular);
}
