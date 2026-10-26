import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { FindReplaceWorkspace } from "@/components/tools/implementations/find-replace-workspace";

const tool = getTool("find-and-replace")!;

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
          <p>Type what to find and what to replace it with. Matches are highlighted in a preview before you commit, so you can check them before clicking Replace all.</p>
          <h2>Options</h2>
          <ul>
            <li><strong>Case-sensitive</strong> - match exact letter casing.</li>
            <li><strong>Whole word</strong> - only match the term as a complete word, not inside other words.</li>
          </ul>
        </>
      }
    >
      <FindReplaceWorkspace />
    </ToolPageLayout>
  );
}
