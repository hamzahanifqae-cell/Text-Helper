export interface Category {
  id: string;
  title: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: "counters", title: "Text Counters", description: "Word, character, sentence, and timing statistics." },
  { id: "grammar", title: "Grammar & Spelling", description: "Catch common mistakes and get deeper AI suggestions." },
  { id: "humanizer", title: "AI Humanizer", description: "Make AI-assisted or stiff writing sound more natural." },
  { id: "rewriting", title: "Rewriting & Writing Assistants", description: "Paraphrase, simplify, change tone, and generate copy." },
  { id: "summarization", title: "Summarization", description: "Condense long text into summaries and key points." },
  { id: "ai-detection", title: "AI Writing Analysis", description: "Experimental writing-pattern analysis - not an authorship verdict." },
  { id: "readability", title: "Readability & Analysis", description: "Scores, word frequency, and keyword density." },
  { id: "cleanup", title: "Text Cleanup", description: "Remove extra spaces, duplicate lines, HTML tags, and more." },
  { id: "case", title: "Case Conversion", description: "Upper, lower, sentence, title, and toggle case." },
  { id: "compare", title: "Find, Replace & Compare", description: "Search and replace text, or diff two versions." },
  { id: "lists", title: "List & Line Tools", description: "Sort, number, deduplicate, and modify lines." },
  { id: "privacy", title: "Extraction & Privacy", description: "Pull out emails, URLs, and redact personal info." },
  { id: "formatting", title: "Formatting & Encoding", description: "Markdown, HTML escaping, and URL encoding." },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
