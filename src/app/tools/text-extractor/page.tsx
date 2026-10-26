import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextExtractorWorkspace } from "@/components/tools/implementations/text-extractor-workspace";

const tool = getTool("text-extractor")!;

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
          <p>Paste text and pick a type. Matches are found with pattern matching (regular expressions) and listed one per line, with duplicates removed for emails, URLs, and hashtags.</p>
          <h2>Limitations</h2>
          <p>Pattern-based detection can occasionally miss unusual formats or pick up a false positive (e.g. a number that looks like part of a larger token). Review the results before relying on them.</p>
        </>
      }
    >
      <TextExtractorWorkspace />
    </ToolPageLayout>
  );
}
