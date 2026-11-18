import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { FindReplaceWorkspace } from "@/components/tools/implementations/find-replace-workspace";

const tool = getTool("find-and-replace")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Type what to find and what to replace it with. Matches are highlighted in a preview before you
            commit, so you can check them before clicking Replace all. Everything runs in your browser.
          </p>
          <h2>Example</h2>
          <p>
            Find <code>colour</code>, replace with <code>color</code>, with whole word on. In
            &quot;The colour of the colourful poster changed.&quot; only the first <code>colour</code> is
            replaced; <code>colourful</code> is left alone.
          </p>
          <h2>Options</h2>
          <ul>
            <li>
              <strong>Case-sensitive</strong> — match exact letter casing.
            </li>
            <li>
              <strong>Whole word</strong> — match the term as a complete word, not inside longer words.
            </li>
          </ul>
          <h2>Limitations</h2>
          <p>This tool does not support regular expressions. Review the preview before replacing in a long draft.</p>
        </>
      }
    >
      <FindReplaceWorkspace />
    </ToolPageLayout>
  );
}
