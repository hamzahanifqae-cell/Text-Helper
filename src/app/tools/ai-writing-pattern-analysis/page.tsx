import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AiPatternAnalysisWorkspace } from "@/components/tools/implementations/ai-pattern-analysis-workspace";

const tool = getTool("ai-writing-pattern-analysis")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste text to see writing-style statistics computed in your browser: sentence count, average
            sentence length, sentence-length variation, vocabulary variety, transition-word density, and
            repeated sentence openings. Those numbers stay on your device.
          </p>
          <p>
            Optionally, click <strong>Get AI commentary</strong>. That control sends the current text and the
            computed statistics to TextHelper&apos;s API, which forwards them to Groq for a plain-language
            explanation. A short notice appears above the button before you click. Text is not sent while you
            type.
          </p>
          <h2>Example</h2>
          <p>
            A short uniform paragraph can show low sentence-length variation and repeated openings such as
            &quot;The &quot;. That is a descriptive signal about rhythm, not proof that a person or a model
            wrote the text.
          </p>
          <h2>Why there is no AI-generated percentage</h2>
          <p>
            This tool does not produce a calibrated probability that text is AI-generated or human-written.
            Presenting a made-up confidence score as a measurement would be dishonest. The optional commentary
            is instructed not to invent an authorship percentage; if one appears, it is removed before you see
            the result.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>These signals are descriptive, not diagnostic. Human writing can be uniform; AI writing can vary.</li>
            <li>Short text produces weaker statistics. A few paragraphs work better than a single sentence.</li>
            <li>Do not use this output as proof of authorship.</li>
          </ul>
        </>
      }
    >
      <AiPatternAnalysisWorkspace />
    </ToolPageLayout>
  );
}
