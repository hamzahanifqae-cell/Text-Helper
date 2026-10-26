import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { HumanizerWorkspace } from "@/components/tools/implementations/humanizer-workspace";

const tool = getTool("ai-text-humanizer")!;

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
            Paste text, choose a tone and rewrite strength, and click Humanize text. The AI rewrites it with
            more natural wording and less repetitive or generic phrasing, while trying to preserve meaning,
            facts, and anything you&apos;ve marked as protected.
          </p>
          <h2>What this is - and isn&apos;t</h2>
          <p>
            This is a writing-quality improvement tool. It is <strong>not</strong> a tool for evading
            AI-content detectors or hiding AI authorship, and we don&apos;t claim or imply that it does that.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>Higher rewrite strength changes sentence structure more aggressively - review the result for accuracy.</li>
            <li>Preserving quotes, citations, and protected phrases is a best-effort request to the AI, not a guarantee; we check afterward and flag anything that didn&apos;t survive.</li>
          </ul>
        </>
      }
    >
      <HumanizerWorkspace />
    </ToolPageLayout>
  );
}
