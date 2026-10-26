import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextStatsWorkspace } from "@/components/tools/implementations/text-stats-workspace";

const tool = getTool("word-counter")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How counting works</h2>
          <p>
            Words are detected with Unicode-aware word segmentation rather than simple whitespace splitting,
            so this handles accented text, CJK, Arabic, and other scripts better than a naive splitter -
            though languages written without spaces between words (Chinese, Japanese, Thai) are still only
            approximated. Sentences are detected using punctuation heuristics, so abbreviations like
            &quot;Mr.&quot; or decimals can occasionally over- or under-count.
          </p>
          <h2>Reading and speaking time</h2>
          <p>Reading time assumes 200 words per minute; speaking time assumes 130 words per minute. Both are averages and will be off for technical text or different reading/speaking speeds.</p>
          <h2>Selected text</h2>
          <p>Select any portion of your text in the box above to see stats for just that selection.</p>
        </>
      }
    >
      <TextStatsWorkspace toolSlug={tool.slug} emphasis="words" />
    </ToolPageLayout>
  );
}
