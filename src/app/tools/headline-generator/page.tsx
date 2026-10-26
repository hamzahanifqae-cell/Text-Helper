import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { HeadlineGeneratorWorkspace } from "@/components/tools/implementations/headline-generator-workspace";

const tool = getTool("headline-generator")!;

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
          <p>Paste the content you need a headline for, choose how many options you want, and click Generate. Each headline is meant to be supported by the content you pasted.</p>
          <h2>Example use</h2>
          <p>Getting a few title options for a blog post or article draft.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Headlines are generated from your content, not researched independently - they can only reflect claims that are actually in the text.</li>
          </ul>
        </>
      }
    >
      <HeadlineGeneratorWorkspace />
    </ToolPageLayout>
  );
}
