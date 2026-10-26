import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { MarkdownEditorWorkspace } from "@/components/tools/implementations/markdown-editor-workspace";

const tool = getTool("markdown-editor")!;

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
          <p>Write Markdown in the editor and see a live preview below it. The preview is rendered to HTML and then sanitized before display, so pasted or typed script tags and other active content can&apos;t execute.</p>
          <h2>Limitations</h2>
          <p>Supports standard Markdown (headings, lists, links, bold/italic, code, tables via GFM). Raw HTML embedded in your Markdown is stripped of anything that could run code (scripts, event handlers, iframes).</p>
        </>
      }
    >
      <MarkdownEditorWorkspace />
    </ToolPageLayout>
  );
}
