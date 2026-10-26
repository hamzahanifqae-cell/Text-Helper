import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("introduction-generator")!;

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
          <p>Paste the body content your introduction should lead into, then click Generate. The AI writes an opening paragraph grounded only in what that content actually covers.</p>
          <h2>Example use</h2>
          <p>Drafting an opening paragraph for an article, report, or blog post you&apos;ve already written the body of.</p>
          <h2>Limitations</h2>
          <ul>
            <li>The result reflects only what&apos;s in the pasted content - it won&apos;t reference facts you haven&apos;t included.</li>
            <li>Review tone and claims before publishing, as with any AI-generated text.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="introduction-generator" generateLabel="Generate introduction" />
    </ToolPageLayout>
  );
}
