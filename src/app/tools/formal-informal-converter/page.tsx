import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { FormalInformalWorkspace } from "@/components/tools/implementations/formal-informal-workspace";

const tool = getTool("formal-informal-converter")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste text, choose one direction under the box, and click Generate. Make formal removes
            contractions and slang. Make informal allows contractions and conversational wording.
          </p>
          <h2>Make formal</h2>
          <p>One run of a short email:</p>
          <p>&quot;Hey, can you send me the notes? I can&apos;t make the meeting.&quot;</p>
          <p>&quot;Could you please send me the notes? I will be unable to attend the meeting.&quot;</p>
          <h2>Make informal</h2>
          <p>One run in the other direction:</p>
          <p>&quot;Please submit the report by Friday. I am unable to extend the deadline.&quot;</p>
          <p>&quot;Please get the report in by Friday—I can&apos;t push the deadline.&quot;</p>
          <p>Another run can word these differently. Read the result before you send it.</p>
          <p>
            Both directions stay on this page. For a change that is not formal or informal, such as a friendlier
            or more confident tone, use the{" "}
            <a href="/tools/tone-changer" className="text-primary underline">
              Tone Changer
            </a>
            . After a formal rewrite, the{" "}
            <a href="/tools/grammar-checker" className="text-primary underline">
              Grammar Checker
            </a>{" "}
            can catch spelling and punctuation.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>What counts as formal varies by industry and audience. Review the result before using it in a professional context.</li>
          </ul>
        </>
      }
    >
      <FormalInformalWorkspace />
    </ToolPageLayout>
  );
}
