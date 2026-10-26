import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("outline-generator")!;

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
          <p>Paste content and click Generate. The AI produces a nested bullet outline reflecting the structure and points already present in the content.</p>
          <h2>Example use</h2>
          <p>Turning a finished draft back into an outline to reorganize it, or outlining notes before writing.</p>
          <h2>Limitations</h2>
          <ul>
            <li>The outline only reflects points already in your text - it won&apos;t suggest content you haven&apos;t written.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="outline-generator" generateLabel="Generate outline" />
    </ToolPageLayout>
  );
}
