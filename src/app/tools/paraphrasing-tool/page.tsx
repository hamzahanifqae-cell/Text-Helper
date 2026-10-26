import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("paraphrasing-tool")!;

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
          <p>
            Paste a paragraph or more and click Generate. The AI rewrites it with different wording and
            sentence structure while keeping the same meaning and the same points, in the same order.
          </p>
          <h2>Example use</h2>
          <p>Reworking a sentence that sounds too close to a source, or getting an alternate way to phrase an idea.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Paraphrased text can still carry meaning very close to the original - it is not a tool for disguising authorship.</li>
            <li>Very short input (a few words) may come back nearly unchanged, since there isn&apos;t much to vary.</li>
            <li>Review the result for accuracy before using it - the AI can occasionally drop a nuance.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="paraphrase" />
    </ToolPageLayout>
  );
}
