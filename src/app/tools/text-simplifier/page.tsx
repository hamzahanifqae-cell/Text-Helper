import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("text-simplifier")!;

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
          <p>Paste text and click Generate. The AI rewrites it with shorter sentences and plainer words, aimed at a general reader, while keeping every point.</p>
          <h2>Example use</h2>
          <p>Making technical or academic writing easier to follow for a wider audience.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Technical terms that are essential to the meaning may be kept, even when simplified elsewhere.</li>
            <li>Simplifying can occasionally lose a precise nuance - review before publishing.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="simplify" />
    </ToolPageLayout>
  );
}
