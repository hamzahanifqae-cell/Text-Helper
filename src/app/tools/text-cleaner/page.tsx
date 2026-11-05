import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextCleanerWorkspace } from "@/components/tools/implementations/text-cleaner-workspace";
import { toolPageMetadata } from "@/lib/seo/metadata";

const tool = getTool("text-cleaner")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>Paste text and click any cleanup operation to apply it immediately. Each operation is undoable with the undo button above the editor, so nothing is permanently lost. Removing extra spaces does not delete blank lines.</p>
          <h2>Example</h2>
          <p>
            Two spaces or a tab between words collapse to one space, and spaces at the start or end of a line
            are removed. <code>Hello   world</code> followed by a blank line and <code>Next</code> with a tab
            before <code>line</code> becomes <code>Hello world</code>, a blank line, then <code>Next line</code>.
            Use <strong>Remove empty lines</strong> if you also want that blank line gone.
          </p>
          <h2>What each operation does</h2>
          <ul>
            <li><strong>Remove extra spaces</strong> - collapses repeated spaces and tabs to one space, and trims each line. Line breaks stay.</li>
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
