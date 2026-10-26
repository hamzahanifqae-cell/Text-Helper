import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("flow-consistency-improver")!;

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
          <p>Paste multi-sentence or multi-paragraph text and click Generate. The AI smooths transitions and keeps verb tense, point of view, and terminology consistent throughout, without changing the content or order of ideas.</p>
          <h2>Example use</h2>
          <p>Cleaning up a draft that was written in several sittings and reads unevenly.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Works best on at least a few sentences - there isn&apos;t much &quot;flow&quot; to fix in a single short sentence.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="flow-consistency" />
    </ToolPageLayout>
  );
}
