import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextCompareWorkspace } from "@/components/tools/implementations/text-compare-workspace";

const tool = getTool("text-compare")!;

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
          <p>Paste the original text on the left and the revised version on the right. Additions are highlighted in green, deletions in red with a strikethrough. Switch between word-level and line-level comparison depending on what you&apos;re comparing.</p>
          <h2>Example use</h2>
          <p>Reviewing edits between two drafts, or checking what an AI rewrite tool actually changed.</p>
        </>
      }
    >
      <TextCompareWorkspace />
    </ToolPageLayout>
  );
}
