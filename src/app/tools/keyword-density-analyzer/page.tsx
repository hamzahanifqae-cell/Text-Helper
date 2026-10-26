import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { KeywordDensityWorkspace } from "@/components/tools/implementations/keyword-density-workspace";

const tool = getTool("keyword-density-analyzer")!;

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
          <p>Paste text to see the most frequent words, repeated multi-word phrases, and overall vocabulary variety (unique words / total words). Optionally check the occurrence count and density of a specific keyword or phrase.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Keyword density is not a guarantee of search ranking - modern search engines evaluate relevance far beyond simple word counts.</li>
            <li>The common-words filter uses a general English stop-word list and may not suit every language or domain.</li>
          </ul>
        </>
      }
    >
      <KeywordDensityWorkspace />
    </ToolPageLayout>
  );
}
