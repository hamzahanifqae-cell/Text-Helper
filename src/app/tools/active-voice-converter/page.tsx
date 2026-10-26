import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("active-voice-converter")!;

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
          <p>Paste text and click Generate. Passive-voice sentences are rewritten into active voice where that improves clarity; sentences that are already active, or where passive voice is clearly intentional, are left alone.</p>
          <h2>Example use</h2>
          <p>&quot;The report was reviewed by the team&quot; becomes &quot;The team reviewed the report.&quot;</p>
          <h2>Limitations</h2>
          <ul>
            <li>Passive voice is sometimes the right choice (e.g. when the actor is unknown or unimportant) - the AI tries to judge this, but isn&apos;t always right.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="active-voice" />
    </ToolPageLayout>
  );
}
