import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("inclusive-language-checker")!;

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
          <p>Paste text and click Generate. The AI looks for unnecessarily gendered, ableist, or otherwise exclusionary language and rewrites it with inclusive alternatives, keeping the same meaning.</p>
          <h2>Example use</h2>
          <p>Reviewing job postings, policies, or public-facing copy for more inclusive phrasing.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Judgments about inclusive language vary by audience, region, and context - treat suggestions as a starting point, not a final ruling.</li>
            <li>This tool does not flag every possible issue, and may occasionally suggest a change that isn&apos;t needed for your audience.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="inclusive-language" />
    </ToolPageLayout>
  );
}
