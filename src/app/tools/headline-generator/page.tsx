import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { HeadlineGeneratorWorkspace } from "@/components/tools/implementations/headline-generator-workspace";

const tool = getTool("headline-generator")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste a draft or a short topic, choose how many headlines you want, and click Generate headlines.
            Each headline has to be supported by that text. The tool does not look up the subject or add facts
            that you did not write.
          </p>
          <h2>Example</h2>
          <p>This topic was pasted into the box:</p>
          <p>
            &quot;Our campus library will stay open until 9 p.m. on weeknights starting in January so students
            can study after class.&quot;
          </p>
          <p>One run returned these three headlines:</p>
          <ul>
            <li>Campus library extends weeknight hours to 9 p.m. starting January</li>
            <li>Library will stay open until 9 p.m. on weeknights beginning in January</li>
            <li>Students get more study time as library stays open to 9 p.m. on weeknights</li>
          </ul>
          <p>Another run can word them differently. Check each line against your draft before you publish it.</p>
          <p>
            After you choose a headline, the{" "}
            <a href="/tools/introduction-generator" className="text-primary underline">
              Introduction Generator
            </a>{" "}
            can write the opening from the same draft.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>A one-word topic gives the model very little to use. Paste the claim or the draft you want the headline to reflect.</li>
            <li>Headlines are not checked against search demand, and they are not a substitute for editing the article.</li>
          </ul>
        </>
      }
    >
      <HeadlineGeneratorWorkspace />
    </ToolPageLayout>
  );
}
