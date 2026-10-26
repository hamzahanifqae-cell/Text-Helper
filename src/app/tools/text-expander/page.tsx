import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("text-expander")!;

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
          <p>Paste short text and click Generate. The AI elaborates on the existing points with more detail and explanation - it does not invent new facts.</p>
          <h2>Example use</h2>
          <p>Turning a brief outline-like paragraph into a fuller one.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Expansion stays close to what you provided - for genuinely new supporting facts, add them yourself and re-run the tool.</li>
            <li>Very short input (a single short sentence) gives the AI little to elaborate on.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="expand" />
    </ToolPageLayout>
  );
}
