import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("active-voice-converter")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste text and click Generate. The only direction is passive voice to active voice. A sentence
            that is already active stays as it is. Where the actor is unknown or the passive wording is
            clearly intentional, the instruction is to leave that sentence unchanged.
          </p>
          <h2>Example</h2>
          <p>
            Passive to active, from one run: &quot;The report was reviewed by the team on Monday.&quot; became
            &quot;The team reviewed the report on Monday.&quot;
          </p>
          <p>
            Already active, from one run: &quot;The team reviewed the report on Monday.&quot; stayed &quot;The
            team reviewed the report on Monday.&quot;
          </p>
          <p>Another run can word the active sentence differently. Read it before you use it.</p>
          <p>
            If the sentence is active and you still want different wording, use the{" "}
            <a href="/tools/paraphrasing-tool" className="text-primary underline">
              Paraphrasing Tool
            </a>
            . For spelling and punctuation, use the{" "}
            <a href="/tools/grammar-checker" className="text-primary underline">
              Grammar Checker
            </a>
            .
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>This page does not convert active voice into passive voice.</li>
            <li>Passive voice is sometimes the right choice, for example when the actor is unknown. The model tries to judge that and is not always right.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace
        toolSlug={tool.slug}
        taskId="active-voice"
        placeholder="Paste passive-voice text…"
        guidance={
          <p>
            Passive voice is rewritten into active voice. A sentence that is already active stays as it is.
            This tool does not turn active voice into passive voice.
          </p>
        }
      />
    </ToolPageLayout>
  );
}
