import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ListLineToolsWorkspace } from "@/components/tools/implementations/list-line-tools-workspace";

const tool = getTool("list-line-tools")!;

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
          <p>Paste a list with one item per line, then apply any operation. Each one is undoable with the undo button above the editor.</p>
          <h2>What each operation does</h2>
          <ul>
            <li><strong>Sort A-Z / Z-A</strong> - alphabetical sort, case-insensitive.</li>
            <li><strong>Reverse order</strong> - flips the line order top to bottom.</li>
            <li><strong>Number lines</strong> - prefixes each line with &quot;1. &quot;, &quot;2. &quot;, etc.</li>
            <li><strong>Remove duplicates</strong> - keeps the first occurrence of each line (case-insensitive).</li>
            <li><strong>Add/remove prefix or suffix</strong> - adds or strips the text you enter from every non-empty line.</li>
          </ul>
        </>
      }
    >
      <ListLineToolsWorkspace />
    </ToolPageLayout>
  );
}
