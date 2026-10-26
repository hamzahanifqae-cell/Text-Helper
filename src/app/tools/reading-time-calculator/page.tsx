import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextStatsWorkspace } from "@/components/tools/implementations/text-stats-workspace";

const tool = getTool("reading-time-calculator")!;

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
          <h2>How this is calculated</h2>
          <p>
            Reading time assumes 200 words per minute, a commonly used average for adult silent reading of
            English text. Speaking time assumes 130 words per minute, a typical conversational pace. Both are
            estimates - actual speed varies by reader, content difficulty, and language.
          </p>
          <h2>Limitations</h2>
          <p>These figures are most accurate for straightforward English prose; dense technical writing, poetry, or other languages will read at different real-world speeds.</p>
        </>
      }
    >
      <TextStatsWorkspace toolSlug={tool.slug} emphasis="time" />
    </ToolPageLayout>
  );
}
