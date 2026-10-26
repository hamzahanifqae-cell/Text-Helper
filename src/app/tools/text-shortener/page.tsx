import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("text-shortener")!;

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
          <h2>How it works</h2>
          <p>Paste text and click Generate. The AI condenses it, cutting redundancy and filler while keeping every essential point.</p>
          <h2>Example use</h2>
          <p>Fitting a paragraph into a tighter word or character limit without losing key information.</p>
          <h2>Limitations</h2>
          <ul>
            <li>This is not a hard character-count tool - the result is noticeably shorter, not an exact target length.</li>
            <li>If the source is already tight, there may not be much to cut.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="shorten" />
    </ToolPageLayout>
  );
}
