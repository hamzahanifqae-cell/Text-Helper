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
          <p>&quot;Hey, can you send me the notes? I can&apos;t make the meeting.&quot;</p>
          <p>&quot;Could you send me the notes? I am unable to attend the meeting.&quot;</p>
          <h2>Make informal</h2>
          <p>&quot;Please submit the report by Friday. I am unable to extend the deadline.&quot;</p>
          <p>&quot;Please send the report by Friday. I can&apos;t extend the deadline.&quot;</p>
          <p>
            These pairs follow the two instructions the buttons send. A generated result can be worded differently, so review it before you use it.
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
