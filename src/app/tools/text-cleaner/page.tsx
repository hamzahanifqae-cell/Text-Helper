import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextCleanerWorkspace } from "@/components/tools/implementations/text-cleaner-workspace";

const tool = getTool("text-cleaner")!;

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
          <p>Paste text and click any cleanup operation to apply it immediately. Each operation is undoable with the undo button above the editor, so nothing is permanently lost.</p>
          <h2>What each operation does</h2>
          <ul>
            <li><strong>Remove extra spaces</strong> - collapses repeated spaces/tabs and trims line edges.</li>
            <li><strong>Remove empty lines</strong> - deletes blank lines entirely.</li>
            <li><strong>Remove duplicate lines</strong> - keeps the first occurrence of each line.</li>
            <li><strong>Normalize line breaks</strong> - converts CRLF/CR to LF and collapses 3+ blank lines to one.</li>
            <li><strong>Strip pasted formatting</strong> - removes invisible zero-width characters and converts smart quotes/dashes to plain ASCII equivalents.</li>
            <li><strong>Remove HTML tags</strong> - strips tags and decodes common HTML entities.</li>
            <li><strong>Tabs/spaces conversion</strong> - converts between tab characters and 4-space indentation.</li>
          </ul>
        </>
      }
    >
      <TextCleanerWorkspace />
    </ToolPageLayout>
  );
}
