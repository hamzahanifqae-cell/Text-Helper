import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("conclusion-generator")!;

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
          <p>Paste the content you want to wrap up, then click Generate. The AI writes a concise closing paragraph that reinforces the main point without introducing new claims.</p>
          <h2>Example use</h2>
          <p>Finishing an article, report, or essay that doesn&apos;t yet have a closing paragraph.</p>
          <h2>Limitations</h2>
          <ul>
            <li>The conclusion only reflects what&apos;s in the pasted content.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="conclusion-generator" generateLabel="Generate conclusion" />
    </ToolPageLayout>
  );
}
