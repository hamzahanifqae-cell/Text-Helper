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
          <p>
            Escape converts characters like &lt;, &gt;, &amp;, and quotes into HTML entities so the text can
            sit safely inside HTML. Unescape reverses common entities back to plain characters. Everything
            runs in your browser.
          </p>
          <h2>Example</h2>
          <p>
            Escape turns <code>&lt;div class=&quot;note&quot;&gt;</code> into
            <code>&amp;lt;div class=&amp;quot;note&amp;quot;&amp;gt;</code>. Unescape reverses that.
          </p>
          <h2>Limitations</h2>
          <p>
            This is for displaying text inside HTML, not for sanitizing a full page of markup that should still
            render as HTML.
          </p>
        </>
      }
    >
      <HtmlEscapeWorkspace />
    </ToolPageLayout>
  );
}
