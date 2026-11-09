export interface Category {
  id: string;
  title: string;
  description: string;
  /** Who this group is for. */
  audience: string;
  /** How to pick among the tools in the group. */
  choose: string;
  /** Tool to open first. */
  startSlug: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "counters",
    title: "Text Counters",
    description: "Word, character, sentence, and timing statistics.",
    audience: "Writers checking a limit, and editors estimating how long a draft takes to read.",
    choose: "Start with the word counter for words, sentences, and paragraphs. Use the character counter when the limit counts characters with or without spaces. Use the reading-time calculator when you need minutes rather than a count.",
    startSlug: "word-counter",
  },
  {
    id: "grammar",
    title: "Grammar & Spelling",
    description: "Catch common mistakes, with optional AI suggestions.",
    audience: "Anyone proofreading a draft before they send it.",
    choose: "This category has one tool. The checks for spelling, repeated words, and US/UK spelling run in the browser. The deeper suggestions run only after you ask for them.",
    startSlug: "grammar-checker",
  },
  {
    id: "humanizer",
    title: "Natural Tone",
    description: "Rewrite stiff or generic wording into a clearer tone.",
    audience: "People whose draft sounds stiff or repetitive and who want a more natural tone.",
    choose: "This category has one tool. It changes wording and tone. It does not decide who wrote the text, and it does not bypass AI detectors.",
    startSlug: "ai-text-humanizer",
  },
  {
    id: "rewriting",
    title: "Rewriting & Writing Assistants",
    description: "Paraphrase, simplify, change tone, and generate copy.",
    audience: "People who already have a draft and want a different wording, tone, or a new opening, close, or outline.",
    choose: "Use Paraphrase to reword, Text Simplifier for plainer language, and Tone Changer for a named tone. Formal / Informal has two directions. Active Voice only turns passive sentences into active ones. Headline, introduction, conclusion, and outline create a new piece from the text you paste.",
    startSlug: "paraphrasing-tool",
  },
  {
    id: "summarization",
    title: "Summarization",
    description: "Condense long text into a paragraph, bullets, or key points.",
    audience: "People who need a shorter version of a passage they already have.",
    choose: "This category has one tool. Paste the source text and choose a paragraph, bullet list, or key points. It does not add facts that are not in the paste.",
    startSlug: "text-summarizer",
  },
  {
    id: "ai-detection",
    title: "AI Writing Analysis",
    description: "Experimental writing-style signals. Not an authorship verdict.",
    audience: "People who want descriptive statistics about a draft, such as sentence-length variation.",
    choose: "This category has one tool. It reports style signals in the browser. An optional explanation can be requested afterward. It does not give an AI-written percentage or an authorship verdict.",
    startSlug: "ai-writing-pattern-analysis",
  },
  {
    id: "readability",
    title: "Readability & Analysis",
    description: "Scores, word frequency, and keyword density.",
    audience: "Editors comparing how difficult a passage is, or checking how often a word appears.",
    choose: "Use the readability checker for Flesch, Flesch-Kincaid, and Gunning Fog. Use the keyword density analyzer for word frequency and repeated phrases. Neither score is a ranking guarantee.",
    startSlug: "readability-checker",
  },
  {
    id: "cleanup",
    title: "Text Cleanup",
    description: "Remove extra spaces, duplicate lines, HTML tags, and more.",
    audience: "People cleaning text pasted from a document, a web page, or a chat.",
    choose: "This category has one tool. Remove extra spaces first if the problem is repeated spaces or tabs. Empty lines, duplicate lines, and HTML tags are separate steps.",
    startSlug: "text-cleaner",
  },
  {
    id: "case",
    title: "Case Conversion",
    description: "Upper, lower, sentence, title, and toggle case.",
    audience: "People who need to change capitalization without retyping.",
    choose: "This category has one tool. Uppercase, lowercase, sentence case, title case, and toggle case are buttons on that page.",
    startSlug: "case-converter",
  },
  {
    id: "compare",
    title: "Find, Replace & Compare",
    description: "Search and replace text, or compare two versions.",
    audience: "People editing one draft, or comparing two versions of the same text.",
    choose: "Use Find and Replace to change words in one text. Use Text Compare when you have two texts and want additions and deletions highlighted.",
    startSlug: "text-compare",
  },
  {
    id: "lists",
    title: "List & Line Tools",
    description: "Sort, number, deduplicate, and modify lines.",
    audience: "People working with one item per line, such as names or keywords.",
    choose: "This category has one tool. Sort, reverse, number, deduplicate, and add or remove a prefix or suffix are on that page.",
    startSlug: "list-line-tools",
  },
  {
    id: "privacy",
    title: "Extraction & Privacy",
    description: "Pull out emails and URLs, or redact contact details.",
    audience: "People pulling structured bits out of a paste, or hiding contact details before sharing.",
    choose: "Use Text Extractor to list emails, URLs, hashtags, and numbers. Use Privacy Redactor to find and mask recognizable emails and phone numbers. Redaction is pattern-based and can miss unusual formats.",
    startSlug: "privacy-redactor",
  },
  {
    id: "formatting",
    title: "Formatting & Encoding",
    description: "Markdown preview, HTML escaping, and URL encoding.",
    audience: "People preparing text for a page, a code sample, or a link.",
    choose: "Use the Markdown editor for a sanitized preview. Use HTML Escape to encode or decode HTML entities. Use the URL encoder for percent-encoding a component, not a whole page.",
    startSlug: "markdown-editor",
  },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
