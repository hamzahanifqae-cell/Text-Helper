import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextStatsWorkspace } from "@/components/tools/implementations/text-stats-workspace";
import { toolPageMetadata } from "@/lib/seo/metadata";

const tool = getTool("word-counter")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>Example</h2>
          <p>
            <code>Hello, world!</code> counts as 2 words, 13 characters with spaces, and 12 characters
            without spaces. The comma and exclamation mark are characters, not words. <code>café 👍🏽</code> counts
            as 1 word and 6 characters with the space: the thumbs-up emoji is one character and is not a word.
            <code>你好世界</code> is 4 characters and 2 word-like segments in this counter, which may not match
            how a reader of Chinese would divide it.
          </p>
          <h2>How counting works</h2>
          <p>
            Words use Unicode word segmentation, not a split on spaces. That handles accented text, Arabic,
            and other scripts better than counting spaces, but Chinese, Japanese, and Thai are still an
            approximation. Sentences split on periods, exclamation marks, and question marks, so
            &quot;Mr.&quot; and decimals can be counted as extra sentences. Paragraphs are blocks separated
            by a blank line. <code>Line one</code> followed by a blank line and <code>Line two</code> is 4 words,
            2 paragraphs, and 3 lines, because the empty line is a line of its own.
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
