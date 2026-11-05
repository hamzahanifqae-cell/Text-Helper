import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import type { ToolMeta } from "@/lib/registry/tools";

/**
 * Page-specific descriptions. These are hypotheses about what the page is
 * for, written from the tool's actual behavior. They are not keyword lists.
 */
const TOOL_DESCRIPTIONS: Record<string, string> = {
  "word-counter":
    "Count words, sentences, paragraphs, and lines in pasted text. The page also shows characters and a reading-time estimate, and explains how spaces, punctuation, emoji, and text without spaces are counted.",
  "character-counter":
    "Count characters with spaces and without spaces. Emoji and accented letters count as one character. Spaces and line breaks are included only in the with-spaces total.",
  "reading-time-calculator":
    "Estimate silent reading time at 200 words per minute and speaking time at 130 words per minute. Both are averages for straightforward English and will differ for technical or non-English text.",
  "case-converter":
    "Convert text to uppercase, lowercase, sentence case, title case, or toggle case. Includes a before-and-after example and notes on letters that have no uppercase form.",
  "text-cleaner":
    "Remove extra spaces, empty lines, duplicate lines, and HTML tags from pasted text. Extra spaces collapse to a single space; blank lines stay until you remove them as a separate step.",
};

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const socialTitle = input.absoluteTitle ? input.title : `${input.title} | ${siteConfig.name}`;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      url: input.path,
      title: socialTitle,
      description: input.description,
    },
    twitter: {
      title: socialTitle,
      description: input.description,
    },
  };
}

export function toolPageMetadata(tool: ToolMeta): Metadata {
  return pageMetadata({
    title: tool.title,
    description: TOOL_DESCRIPTIONS[tool.slug] ?? tool.shortDescription,
    path: `/tools/${tool.slug}`,
  });
}
