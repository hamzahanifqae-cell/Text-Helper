import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AiPatternAnalysisWorkspace } from "@/components/tools/implementations/ai-pattern-analysis-workspace";

const tool = getTool("ai-writing-pattern-analysis")!;

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
            Paste text to see a set of writing-style statistics computed instantly in your browser - sentence
            length variation, vocabulary variety, transition-word use, and repeated sentence openings. You can
            optionally ask an AI model to explain those statistics in plain language.
          </p>
          <h2>Why there&apos;s no &quot;AI-generated&quot; percentage</h2>
          <p>
            We looked for a suitably licensed, independently-evaluated AI-authorship detector that would fit
            this project&apos;s free-tier and low-memory hosting constraints, and didn&apos;t find one we were
            willing to present as reliable. Rather than ask a general-purpose AI model to invent a confidence
            score - which would be a fabricated number dressed up as a measurement - this tool reports
            descriptive writing-style signals instead, and is honest about not being an authorship detector.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>These signals are descriptive, not diagnostic - human writing can be uniform, and AI writing can be highly varied.</li>
            <li>Short text produces less reliable statistics - these metrics work best on at least a few paragraphs.</li>
            <li>Never use this tool&apos;s output as proof that a piece of text was or wasn&apos;t written by an AI.</li>
          </ul>
        </>
      }
    >
      <AiPatternAnalysisWorkspace />
    </ToolPageLayout>
  );
}
