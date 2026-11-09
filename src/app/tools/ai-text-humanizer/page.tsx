import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { HumanizerWorkspace } from "@/components/tools/implementations/humanizer-workspace";

const tool = getTool("ai-text-humanizer")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste text, choose a tone and rewrite strength, and click Rewrite tone. The tool asks Groq to
            rewrite stiff or generic wording while keeping the same points. Quotes, citations, and phrases
            you mark as protected are requested to stay as written.
          </p>
          <h2>Example</h2>
          <p>Stiff input: &quot;It is important to note that the meeting was conducted in order to facilitate discussion of the proposal.&quot;</p>
          <p>A conversational rewrite of that sentence: &quot;The meeting was held so we could discuss the proposal.&quot;</p>
          <p>This pair shows the kind of change the instruction requests. The generated wording can differ.</p>
          <h2>What this is</h2>
          <p>
            This is a tone and wording editor. It does not bypass AI-content detectors, hide authorship, or
            say whether a person or a model wrote the original text.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>Higher rewrite strength changes sentence structure more aggressively - review the result for accuracy.</li>
            <li>Preserving quotes, citations, and protected phrases is a best-effort request to the AI, not a guarantee; we check afterward and flag anything that didn&apos;t survive.</li>
          </ul>
        </>
      }
    >
      <HumanizerWorkspace />
    </ToolPageLayout>
  );
}
