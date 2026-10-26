import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { SummarizerWorkspace } from "@/components/tools/implementations/summarizer-workspace";

const tool = getTool("text-summarizer")!;

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
            Paste the text you want summarized, choose a format and length, and click Summarize. The AI is
            instructed to summarize only what&apos;s stated in your text - it should not add facts, statistics,
            or citations that aren&apos;t already present.
          </p>
          <h2>Example use</h2>
          <p>Getting the gist of a long article, report, or set of notes.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Summaries can still miss nuance or over-compress - review against the source before relying on it.</li>
            <li>Length settings are approximate guides for the AI, not exact word counts.</li>
          </ul>
        </>
      }
    >
      <SummarizerWorkspace />
    </ToolPageLayout>
  );
}
