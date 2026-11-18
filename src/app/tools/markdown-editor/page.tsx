import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { MarkdownEditorWorkspace } from "@/components/tools/implementations/markdown-editor-workspace";

const tool = getTool("markdown-editor")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Write Markdown in the editor and see a live preview. The preview is rendered to HTML and then
            sanitized before display, so pasted or typed script tags and other active content cannot execute.
            Processing stays in your browser.
          </p>
          <h2>Example</h2>
          <p>
            <code>## Notes</code> followed by <code>- item one</code> shows a heading and a bullet in the
            preview. A typed <code>&lt;script&gt;</code> tag does not run.
          </p>
          <h2>Limitations</h2>
          <p>
            Supports common Markdown (headings, lists, links, bold/italic, code, and GFM tables). Raw HTML in
            your Markdown is stripped of anything that could run code, such as scripts, event handlers, and
            iframes.
          </p>
        </>
      }
    >
      <MarkdownEditorWorkspace />
    </ToolPageLayout>
  );
}
