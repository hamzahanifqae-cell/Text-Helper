import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { HtmlEscapeWorkspace } from "@/components/tools/implementations/html-escape-workspace";

const tool = getTool("html-escape-tool")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>Escape converts characters like &lt;, &gt;, &amp;, and quotes into HTML entities so the text can be embedded safely inside HTML. Unescape reverses common HTML entities back to plain characters.</p>
          <h2>Example use</h2>
          <p>Preparing a code snippet or user-submitted text to display safely inside an HTML page.</p>
        </>
      }
    >
      <HtmlEscapeWorkspace />
    </ToolPageLayout>
  );
}
