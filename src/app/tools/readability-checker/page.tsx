import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ReadabilityWorkspace } from "@/components/tools/implementations/readability-workspace";

const tool = getTool("readability-checker")!;

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
          <p>
            Paste text to see three standard readability formulas (Flesch Reading Ease, Flesch-Kincaid Grade
            Level, Gunning Fog), plus average word/sentence length, a list of unusually long sentences, and a
            few words with simpler suggested alternatives.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>All three formulas were designed for English and rely on an approximate syllable-counting heuristic - they are directional, not exact.</li>
            <li>The &quot;simpler alternatives&quot; list is a small curated set of commonly-overused words, not a comprehensive dictionary.</li>
            <li>Readability scores describe sentence/word complexity - they don&apos;t measure whether content is accurate, engaging, or well-organized.</li>
          </ul>
        </>
      }
    >
      <ReadabilityWorkspace />
    </ToolPageLayout>
  );
}
