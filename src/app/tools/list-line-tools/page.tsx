import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ListLineToolsWorkspace } from "@/components/tools/implementations/list-line-tools-workspace";

const tool = getTool("list-line-tools")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste a list with one item per line, then apply an operation. Each change is undoable with the
            undo button above the editor. Everything runs in your browser.
          </p>
          <h2>Example</h2>
          <p>
            <code>banana</code>, <code>Apple</code>, <code>apple</code> sorted A–Z becomes
            <code>Apple</code>, <code>apple</code>, <code>banana</code>. Remove duplicates keeps the first
            <code>Apple</code> and drops the later <code>apple</code> when matching is case-insensitive.
          </p>
          <h2>What each operation does</h2>
          <ul>
            <li>
              <strong>Sort A-Z / Z-A</strong> — alphabetical sort, case-insensitive.
            </li>
            <li>
              <strong>Reverse order</strong> — flips the line order top to bottom.
            </li>
            <li>
              <strong>Number lines</strong> — prefixes each line with &quot;1. &quot;, &quot;2. &quot;, and so on.
            </li>
            <li>
              <strong>Remove duplicates</strong> — keeps the first occurrence of each line (case-insensitive).
            </li>
            <li>
              <strong>Add/remove prefix or suffix</strong> — adds or strips the text you enter from every
              non-empty line.
            </li>
          </ul>
          <h2>Limitations</h2>
          <p>Sorting is alphabetical, not numeric. <code>10</code> can sort before <code>2</code>.</p>
        </>
      }
    >
      <ListLineToolsWorkspace />
    </ToolPageLayout>
  );
}
